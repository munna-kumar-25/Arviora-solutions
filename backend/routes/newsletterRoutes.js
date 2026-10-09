const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    subscribeNewsletter,
    unsubscribeNewsletter,
    getAllSubscribers,
    sendNewsletterToAll,
} = require('../controllers/newsletterController');

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to newsletter (Public)
 * @access  Public
 */
router.post('/subscribe', subscribeNewsletter);

/**
 * @route   POST /api/newsletter/unsubscribe
 * @desc    Unsubscribe from newsletter (Public)
 * @access  Public
 */
router.post('/unsubscribe', unsubscribeNewsletter);

/**
 * @route   GET /api/newsletter
 * @desc    Get all newsletter subscribers (Admin only)
 * @query   page, limit, isActive (filters)
 * @access  Private (Admin only)
 */
router.get('/', authMiddleware, getAllSubscribers);

/**
 * @route   POST /api/newsletter/send
 * @desc    Send newsletter to all subscribers (Admin only)
 * @access  Private (Admin only)
 */
router.post('/send', authMiddleware, sendNewsletterToAll);

module.exports = router;
