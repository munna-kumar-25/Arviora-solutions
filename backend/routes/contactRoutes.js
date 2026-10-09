const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { validate, contactSchema } = require('../utils/validators');
const {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    getUnreadCount,
} = require('../controllers/contactController');

/**
 * @route   POST /api/contact
 * @desc    Submit contact form (Public)
 * @access  Public
 */
router.post('/', validate(contactSchema), createContact);

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages (Admin only)
 * @query   isRead, page, limit (filters)
 * @access  Private (Admin only)
 */
router.get('/', authMiddleware, getAllContacts);

/**
 * @route   GET /api/contact/stats/unread
 * @desc    Get unread messages count (Admin only)
 * @access  Private (Admin only)
 */
router.get('/stats/unread', authMiddleware, getUnreadCount);

/**
 * @route   GET /api/contact/:id
 * @desc    Get single contact message (Admin only, marks as read)
 * @access  Private (Admin only)
 */
router.get('/:id', authMiddleware, getContactById);

/**
 * @route   PUT /api/contact/:id
 * @desc    Mark contact as replied (Admin only)
 * @access  Private (Admin only)
 */
router.put('/:id', authMiddleware, updateContact);

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact message (Admin only)
 * @access  Private (Admin only)
 */
router.delete('/:id', authMiddleware, deleteContact);

module.exports = router;
