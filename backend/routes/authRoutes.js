const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validate, registerSchema, loginSchema, profileSchema } = require('../utils/validators');
const {
    login,
    register,
    verifyToken,
    getAdmins,
    getAdminById,
    updateProfile,
    getNotificationSettings,
    updateNotificationSettings,
    sendTestNotification,
} = require('../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin
 * @access  Public
 */
router.post('/register', validate(registerSchema), register);

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', validate(loginSchema), login);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify admin token
 * @access  Private
 */
router.get('/verify', authMiddleware, verifyToken);

/**
 * @route   GET /api/auth/admins
 * @desc    List admin accounts
 * @access  Private
 */
router.get('/admins', authMiddleware, getAdmins);

/**
 * @route   GET /api/auth/admins/:id
 * @desc    Get an admin profile
 * @access  Private
 */
router.get('/admins/:id', authMiddleware, getAdminById);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update the authenticated admin profile
 * @access  Private
 */
router.put('/profile', authMiddleware, validate(profileSchema), updateProfile);

/**
 * @route   GET /api/auth/notifications
 * @desc    Get notification preferences for the authenticated admin
 * @access  Private
 */
router.get('/notifications', authMiddleware, getNotificationSettings);

/**
 * @route   PUT /api/auth/notifications
 * @desc    Update notification preferences for the authenticated admin
 * @access  Private
 */
router.put('/notifications', authMiddleware, updateNotificationSettings);

/**
 * @route   POST /api/auth/notifications/test
 * @desc    Send a test notification email
 * @access  Private
 */
router.post('/notifications/test', authMiddleware, sendTestNotification);

module.exports = router;
