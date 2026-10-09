const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, testimonialSchema } = require('../utils/validators');
const {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} = require('../controllers/testimonialController');

/**
 * @route   GET /api/testimonials
 * @desc    Get all active testimonials (Public)
 * @access  Public
 */
router.get('/', getAllTestimonials);

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get testimonial by ID (Public)
 * @access  Public
 */
router.get('/:id', getTestimonialById);

/**
 * @route   POST /api/testimonials
 * @desc    Create new testimonial
 * @access  Private (Admin only)
 */
router.post('/', authMiddleware, upload.single('image'), validate(testimonialSchema), createTestimonial);

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update testimonial
 * @access  Private (Admin only)
 */
router.put('/:id', authMiddleware, upload.single('image'), validate(testimonialSchema), updateTestimonial);

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete testimonial
 * @access  Private (Admin only)
 */
router.delete('/:id', authMiddleware, deleteTestimonial);

module.exports = router;
