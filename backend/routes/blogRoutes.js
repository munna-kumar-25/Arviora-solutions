const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, blogSchema } = require('../utils/validators');
const {
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
} = require('../controllers/blogController');

/**
 * @route   GET /api/blogs
 * @desc    Get all blogs with pagination & search (Public)
 * @query   page, limit, search, category, isPublished (filters)
 * @access  Public
 */
router.get('/', getAllBlogs);

/**
 * @route   GET /api/blogs/slug/:slug
 * @desc    Get blog by slug (Public)
 * @access  Public
 */
router.get('/slug/:slug', getBlogBySlug);

/**
 * @route   GET /api/blogs/:id
 * @desc    Get blog by ID (Public)
 * @access  Public
 */
router.get('/:id', getBlogById);

/**
 * @route   POST /api/blogs
 * @desc    Create new blog
 * @access  Private (Admin only)
 */
router.post('/', authMiddleware, upload.single('image'), validate(blogSchema), createBlog);

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update blog
 * @access  Private (Admin only)
 */
router.put('/:id', authMiddleware, upload.single('image'), validate(blogSchema), updateBlog);

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete blog
 * @access  Private (Admin only)
 */
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
