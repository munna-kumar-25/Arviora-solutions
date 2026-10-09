const Contact = require('../models/Contact');
const Admin = require('../models/Admin');
const { sendContactNotificationToAdmin, sendConfirmationEmailToUser } = require('../utils/emailService');

/**
 * Get All Contact Messages (Admin only)
 * GET /api/contact
 */
const getAllContacts = async (req, res) => {
    try {
        const { isRead, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        const filter = {};

        if (isRead !== undefined) filter.isRead = isRead === 'true';

        const total = await Contact.countDocuments(filter);
        const contacts = await Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
            contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get Single Contact Message (Admin only)
 * GET /api/contact/:id
 */
const getContactById = async (req, res) => {
    try {
        // Mark as read when viewed
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found',
            });
        }

        res.status(200).json({
            success: true,
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Create Contact Message (Public)
 * POST /api/contact
 */
const createContact = async (req, res) => {
    const {
        name,
        email,
        phone,
        subject,
        message,
        requestType,
        company,
        service,
        preferredDate,
        preferredTime,
    } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and message are required',
        });
    }

    try {
        // Save contact to database
        const contact = new Contact({
            name,
            email,
            phone: phone || null,
            subject: subject || null,
            message,
            requestType: requestType || 'contact',
            company: company || null,
            service: service || null,
            preferredDate: preferredDate || null,
            preferredTime: preferredTime || null,
        });

        await contact.save();

        // Send email notifications
        try {
            const contactData = {
                name,
                email,
                phone,
                subject,
                message,
                requestType,
                company,
                service,
                preferredDate,
                preferredTime,
            };
            const admins = await Admin.find({ isActive: true }).select(
                'email emailNotificationsEnabled contactEmailNotificationsEnabled demoEmailNotificationsEnabled notificationEmail'
            );
            const isDemoRequest = requestType === 'demo';
            const notificationRecipients = [...new Set(admins
                .filter((admin) => isDemoRequest
                    ? (admin.demoEmailNotificationsEnabled ?? admin.emailNotificationsEnabled)
                    : (admin.contactEmailNotificationsEnabled ?? admin.emailNotificationsEnabled))
                .map((admin) => admin.notificationEmail || admin.email)
                .filter(Boolean))];

            if (notificationRecipients.length > 0) {
                await sendContactNotificationToAdmin(contactData, notificationRecipients);
            } else if (admins.length === 0) {
                await sendContactNotificationToAdmin(contactData);
            }

            // Send confirmation email to user
            await sendConfirmationEmailToUser({
                name,
                email,
                subject,
            });
        } catch (emailError) {
            console.error('Email sending error:', emailError.message);
            // Don't fail the request if email fails - message is still saved
        }

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Mark Contact as Replied (Admin only)
 * PUT /api/contact/:id
 */
const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { isReplied: true },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact marked as replied',
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete Contact Message (Admin only)
 * DELETE /api/contact/:id
 */
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get Unread Contact Count (Admin only)
 * GET /api/contact/stats/unread
 */
const getUnreadCount = async (req, res) => {
    try {
        const count = await Contact.countDocuments({ isRead: false });

        res.status(200).json({
            success: true,
            unreadCount: count,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    getUnreadCount,
};
