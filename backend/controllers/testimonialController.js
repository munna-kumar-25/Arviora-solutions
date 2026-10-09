const Testimonial = require('../models/Testimonial');

/**
 * Get All Testimonials
 * GET /api/testimonials
 */
const getAllTestimonials = async (req, res) => {
    try {
        const { isActive } = req.query;
        const filter = { isActive: true };

        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const testimonials = await Testimonial.find(filter).sort('-rating');

        res.status(200).json({
            success: true,
            count: testimonials.length,
            testimonials,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get Single Testimonial
 * GET /api/testimonials/:id
 */
const getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found',
            });
        }

        res.status(200).json({
            success: true,
            testimonial,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Create Testimonial (Admin only)
 * POST /api/testimonials
 */
const createTestimonial = async (req, res) => {
    const { name, company, review, rating, position } = req.body;

    // Validation
    if (!name || !review || !rating) {
        return res.status(400).json({
            success: false,
            message: 'Name, review, and rating are required',
        });
    }

    try {
        const testimonial = new Testimonial({
            name,
            company: company || null,
            review,
            rating,
            image: req.file ? req.file.filename : null,
            position: position || null,
        });

        await testimonial.save();

        res.status(201).json({
            success: true,
            message: 'Testimonial created successfully',
            testimonial,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Update Testimonial (Admin only)
 * PUT /api/testimonials/:id
 */
const updateTestimonial = async (req, res) => {
    try {
        let testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found',
            });
        }

        // Update fields
        const updates = {
            name: req.body.name || testimonial.name,
            company: req.body.company !== undefined ? req.body.company : testimonial.company,
            review: req.body.review || testimonial.review,
            rating: req.body.rating !== undefined ? req.body.rating : testimonial.rating,
            image: req.file ? req.file.filename : testimonial.image,
            position: req.body.position !== undefined ? req.body.position : testimonial.position,
            isActive: req.body.isActive !== undefined ? req.body.isActive : testimonial.isActive,
        };

        testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Testimonial updated successfully',
            testimonial,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete Testimonial (Admin only)
 * DELETE /api/testimonials/:id
 */
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Testimonial deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
};
