const Blog = require('../models/Blog');

const parseStringArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    if (typeof value !== 'string') return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return value.split(',').map(item => item.trim()).filter(Boolean);
    }
};

/**
 * Get All Blogs with Pagination
 * GET /api/blogs?page=1&limit=10&category=technology&search=react
 */
const getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search, isPublished } = req.query;
        const skip = (page - 1) * limit;
        const filter = { isPublished: true }; // Default: only show published blogs

        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }
        // Allow override if explicitly requested
        if (isPublished !== undefined && isPublished !== '') filter.isPublished = isPublished === 'true';

        const total = await Blog.countDocuments(filter);
        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
            blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get Single Blog
 * GET /api/blogs/:id
 */
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get Blog by Slug
 * GET /api/blogs/slug/:slug
 */
const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Create Blog (Admin only)
 * POST /api/blogs
 */
const createBlog = async (req, res) => {
    const { title, content, description, category, tags, author, isPublished, date } = req.body;

    // Validation
    if (!title || !content || !category) {
        return res.status(400).json({
            success: false,
            message: 'Title, content, and category are required',
        });
    }

    try {
        // Parse isPublished - it might come as string 'true' or 'false'
        let publishedStatus = true; // Default to published
        if (isPublished !== undefined && isPublished !== null && isPublished !== '') {
            publishedStatus = isPublished === 'true' || isPublished === true;
        }

        // Parse tags if it's a JSON string
        const tagsArray = parseStringArray(tags);
        const seoKeywords = parseStringArray(req.body.seoKeywords);

        const blog = new Blog({
            title,
            slug: req.body.slug,
            description: description || '',
            metaTitle: req.body.metaTitle || '',
            metaDescription: req.body.metaDescription || '',
            focusKeyword: req.body.focusKeyword || '',
            canonicalUrl: req.body.canonicalUrl || '',
            ogTitle: req.body.ogTitle || '',
            ogDescription: req.body.ogDescription || '',
            imageAlt: req.body.imageAlt || '',
            noIndex: req.body.noIndex ?? false,
            seoKeywords,
            content,
            image: req.file ? req.file.filename : null,
            category,
            tags: tagsArray,
            author: author || 'Arviora Solution',
            date: date || new Date(),
            isPublished: publishedStatus,
        });

        await blog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            blog,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'A blog with this title or URL slug already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Update Blog (Admin only)
 * PUT /api/blogs/:id
 */
const updateBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Parse tags if it's a JSON string
        const tagsArray = req.body.tags !== undefined ? parseStringArray(req.body.tags) : blog.tags;
        const seoKeywords = req.body.seoKeywords !== undefined
            ? parseStringArray(req.body.seoKeywords)
            : blog.seoKeywords;

        // Parse isPublished
        let publishedStatus = blog.isPublished;
        if (req.body.isPublished !== undefined && req.body.isPublished !== null && req.body.isPublished !== '') {
            publishedStatus = req.body.isPublished === 'true' || req.body.isPublished === true;
        }

        // Update fields
        const updates = {
            title: req.body.title || blog.title,
            slug: req.body.slug !== undefined ? req.body.slug : blog.slug,
            description: req.body.description !== undefined ? req.body.description : blog.description,
            metaTitle: req.body.metaTitle !== undefined ? req.body.metaTitle : blog.metaTitle,
            metaDescription: req.body.metaDescription !== undefined ? req.body.metaDescription : blog.metaDescription,
            focusKeyword: req.body.focusKeyword !== undefined ? req.body.focusKeyword : blog.focusKeyword,
            canonicalUrl: req.body.canonicalUrl !== undefined ? req.body.canonicalUrl : blog.canonicalUrl,
            ogTitle: req.body.ogTitle !== undefined ? req.body.ogTitle : blog.ogTitle,
            ogDescription: req.body.ogDescription !== undefined ? req.body.ogDescription : blog.ogDescription,
            imageAlt: req.body.imageAlt !== undefined ? req.body.imageAlt : blog.imageAlt,
            noIndex: req.body.noIndex !== undefined ? req.body.noIndex : blog.noIndex,
            seoKeywords,
            content: req.body.content || blog.content,
            image: req.file ? req.file.filename : (req.body.image || blog.image),
            category: req.body.category || blog.category,
            tags: tagsArray,
            author: req.body.author || blog.author,
            date: req.body.date || blog.date,
            isPublished: publishedStatus,
        };

        blog.set(updates);
        if (req.body.slug !== undefined) blog.markModified('slug');
        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            blog,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'A blog with this title or URL slug already exists',
            });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete Blog (Admin only)
 * DELETE /api/blogs/:id
 */
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
};
