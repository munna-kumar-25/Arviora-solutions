const Service = require('../models/Service');

const attachTopFeatureImages = (topFeatures, imageFiles = [], imageIndexes = []) => {
    const features = Array.isArray(topFeatures) ? topFeatures.map((feature) => ({ ...feature })) : [];
    imageIndexes.forEach((featureIndex, fileIndex) => {
        if (features[featureIndex] && imageFiles[fileIndex]) {
            features[featureIndex].image = imageFiles[fileIndex].filename;
        }
    });
    return features;
};

/**
 * Get All Services
 * GET /api/services
 */
const getAllServices = async (req, res) => {
    try {
        const { category, isActive } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const services = await Service.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            services,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get Single Service
 * GET /api/services/:id
 */
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        res.status(200).json({
            success: true,
            service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Create Service (Admin only)
 * POST /api/services
 */
const createService = async (req, res) => {
    const { title, description, icon, price, duration, features, topFeatures, benefits, category, topFeatureImageIndexes = [] } = req.body;

    // Validation
    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: 'Title and description are required',
        });
    }

    try {
        const topFeatureCards = attachTopFeatureImages(
            topFeatures,
            req.files?.topFeatureImages,
            topFeatureImageIndexes
        );
        if (topFeatureCards.some((feature) => !feature.image)) {
            return res.status(400).json({
                success: false,
                message: 'Every top feature card must include an image',
            });
        }

        const service = new Service({
            title,
            description,
            icon: icon || null,
            image: req.files?.image?.[0]?.filename || null,
            price: price || null,
            duration: duration || null,
            features: features || [],
            topFeatures: topFeatureCards,
            benefits: benefits || [],
            category: category || 'other',
        });

        await service.save();

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Update Service (Admin only)
 * PUT /api/services/:id
 */
const updateService = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        const topFeatureCards = req.body.topFeatures !== undefined
            ? attachTopFeatureImages(
                req.body.topFeatures,
                req.files?.topFeatureImages,
                req.body.topFeatureImageIndexes || []
            )
            : service.topFeatures;
        if (topFeatureCards.some((feature) => !feature.image)) {
            return res.status(400).json({
                success: false,
                message: 'Every top feature card must include an image',
            });
        }

        // Update fields
        const updates = {
            title: req.body.title ?? service.title,
            description: req.body.description ?? service.description,
            icon: req.body.icon !== undefined ? req.body.icon : service.icon,
            image: req.files?.image?.[0]?.filename || service.image,
            price: req.body.price !== undefined ? req.body.price : service.price,
            duration: req.body.duration !== undefined ? req.body.duration : service.duration,
            features: req.body.features !== undefined ? req.body.features : service.features,
            topFeatures: topFeatureCards,
            benefits: req.body.benefits !== undefined ? req.body.benefits : service.benefits,
            category: req.body.category || service.category,
            isActive: req.body.isActive !== undefined ? req.body.isActive : service.isActive,
        };

        service = await Service.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete Service (Admin only)
 * DELETE /api/services/:id
 */
const deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
