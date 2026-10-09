const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * Admin Login
 * POST /api/auth/login
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required',
        });
    }

    try {
        // Find admin and select password
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Admin account is inactive',
            });
        }

        // Match password
        const isPasswordValid = await admin.matchPassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate token
        const token = generateToken(admin._id);
        admin.lastLoginAt = new Date();
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
                createdAt: admin.createdAt,
                lastLoginAt: admin.lastLoginAt,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);

        // Check if it's a database connection error
        if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
            return res.status(503).json({
                success: false,
                message: 'Database connection error. Please try again.',
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Login failed',
        });
    }
};

/**
 * Register Admin (Super Admin only)
 * POST /api/auth/register
 */
const register = async (req, res) => {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required',
        });
    }

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists with this email',
            });
        }

        // Create new admin
        const admin = new Admin({
            email,
            password,
            role: role || 'admin',
        });

        await admin.save();

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
                createdAt: admin.createdAt,
                lastLoginAt: admin.lastLoginAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Verify Token
 * GET /api/auth/verify
 */
const verifyToken = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or admin inactive',
            });
        }

        res.status(200).json({
            success: true,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive,
                createdAt: admin.createdAt,
                lastLoginAt: admin.lastLoginAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * List Admin accounts for the authenticated Admin
 * GET /api/auth/admins
 */
const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find()
            .select('name email role isActive createdAt lastLoginAt')
            .sort({ lastLoginAt: -1, createdAt: -1 })
            .lean();

        return res.status(200).json({ success: true, admins });
    } catch (error) {
        console.error('Get admin directory error:', error);
        return res.status(500).json({ success: false, message: 'Unable to load admin accounts.' });
    }
};

/**
 * Get a single Admin profile for the authenticated Admin
 * GET /api/auth/admins/:id
 */
const getAdminById = async (req, res) => {
    try {
        if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ success: false, message: 'Invalid admin account ID.' });
        }

        const admin = await Admin.findById(req.params.id)
            .select('name email role isActive createdAt lastLoginAt')
            .lean();

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin account not found.' });
        }

        return res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error('Get admin profile error:', error);
        return res.status(500).json({ success: false, message: 'Unable to load this admin profile.' });
    }
};

/**
 * Update the authenticated Admin's profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(
            req.admin.id,
            { $set: { name: req.body.name } },
            { new: true, runValidators: true }
        ).select('name email role isActive createdAt lastLoginAt');

        if (!admin || !admin.isActive) {
            return res.status(404).json({ success: false, message: 'Admin account not found.' });
        }

        return res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error('Update admin profile error:', error);
        return res.status(500).json({ success: false, message: 'Unable to update your profile.' });
    }
};

/**
 * Get notification preferences for the authenticated admin
 * GET /api/auth/notifications
 */
const getNotificationSettings = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select(
            'email emailNotificationsEnabled contactEmailNotificationsEnabled demoEmailNotificationsEnabled inAppNotificationsEnabled notificationEmail'
        );
        if (!admin || !admin.isActive) {
            return res.status(404).json({ success: false, message: 'Admin account not found.' });
        }

        const contactEmailEnabled = admin.contactEmailNotificationsEnabled ?? admin.emailNotificationsEnabled;
        const demoEmailEnabled = admin.demoEmailNotificationsEnabled ?? admin.emailNotificationsEnabled;

        return res.status(200).json({
            success: true,
            settings: {
                emailEnabled: contactEmailEnabled,
                contactEmailEnabled,
                demoEmailEnabled,
                inAppEnabled: admin.inAppNotificationsEnabled ?? true,
                email: admin.notificationEmail || admin.email,
            },
        });
    } catch (error) {
        console.error('Get notification settings error:', error);
        return res.status(500).json({ success: false, message: 'Unable to load notification settings.' });
    }
};

/**
 * Update notification preferences for the authenticated admin
 * PUT /api/auth/notifications
 */
const updateNotificationSettings = async (req, res) => {
    const {
        emailEnabled,
        contactEmailEnabled = emailEnabled,
        demoEmailEnabled = emailEnabled,
        inAppEnabled = true,
        email,
    } = req.body;
    const recipient = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        typeof contactEmailEnabled !== 'boolean' ||
        typeof demoEmailEnabled !== 'boolean' ||
        typeof inAppEnabled !== 'boolean'
    ) {
        return res.status(400).json({ success: false, message: 'Notification preferences must be enabled or disabled.' });
    }
    if ((contactEmailEnabled || demoEmailEnabled) && !emailPattern.test(recipient)) {
        return res.status(400).json({ success: false, message: 'Enter a valid email address for notifications.' });
    }
    if (recipient.length > 254) {
        return res.status(400).json({ success: false, message: 'Notification email address is too long.' });
    }

    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin || !admin.isActive) {
            return res.status(404).json({ success: false, message: 'Admin account not found.' });
        }

        admin.emailNotificationsEnabled = contactEmailEnabled || demoEmailEnabled;
        admin.contactEmailNotificationsEnabled = contactEmailEnabled;
        admin.demoEmailNotificationsEnabled = demoEmailEnabled;
        admin.inAppNotificationsEnabled = inAppEnabled;
        admin.notificationEmail = recipient;
        await admin.save();

        return res.status(200).json({
            success: true,
            message: 'Notification settings saved.',
            settings: {
                emailEnabled: admin.contactEmailNotificationsEnabled,
                contactEmailEnabled: admin.contactEmailNotificationsEnabled,
                demoEmailEnabled: admin.demoEmailNotificationsEnabled,
                inAppEnabled: admin.inAppNotificationsEnabled,
                email: admin.notificationEmail || admin.email,
            },
        });
    } catch (error) {
        console.error('Update notification settings error:', error);
        return res.status(500).json({ success: false, message: 'Unable to save notification settings.' });
    }
};

/**
 * Send a test notification email to the supplied address
 * POST /api/auth/notifications/test
 */
const sendTestNotification = async (req, res) => {
    const recipient = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(recipient) || recipient.length > 254) {
        return res.status(400).json({ success: false, message: 'Enter a valid email address for the test notification.' });
    }

    try {
        const admin = await Admin.findById(req.admin.id).select('isActive');
        if (!admin || !admin.isActive) {
            return res.status(404).json({ success: false, message: 'Admin account not found.' });
        }

        const { sendTestNotificationEmail } = require('../utils/emailService');
        await sendTestNotificationEmail(recipient);
        return res.status(200).json({ success: true, message: `Test notification sent to ${recipient}.` });
    } catch (error) {
        console.error('Send test notification error:', error);
        return res.status(500).json({ success: false, message: 'Could not send the test email. Check the email service configuration and try again.' });
    }
};

module.exports = {
    login,
    register,
    verifyToken,
    getAdmins,
    getAdminById,
    updateProfile,
    getNotificationSettings,
    updateNotificationSettings,
    sendTestNotification,
    generateToken,
};
