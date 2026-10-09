const Joi = require('joi');

/**
 * Validation Schemas
 */

// Auth Validation
exports.loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().min(6).messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
    }),
});

exports.registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().min(6).messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required',
    }),
    role: Joi.string().valid('admin', 'superadmin').optional(),
});

exports.profileSchema = Joi.object({
    name: Joi.string().trim().max(100).allow('').required(),
});

// Contact Validation
const preferredDemoDateSchema = Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .custom((value, helpers) => {
        const [year, month, day] = value.split('-').map(Number);
        const selectedDate = new Date(Date.UTC(year, month - 1, day));

        if (
            selectedDate.getUTCFullYear() !== year ||
            selectedDate.getUTCMonth() !== month - 1 ||
            selectedDate.getUTCDate() !== day
        ) {
            return helpers.error('date.invalid');
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        if (selectedDate < today) {
            return helpers.error('date.min');
        }

        return value;
    })
    .messages({
        'date.invalid': 'Preferred date must be a valid calendar date',
        'date.min': 'Preferred date cannot be in the past',
    });

exports.contactSchema = Joi.object({
    requestType: Joi.string().valid('contact', 'demo').default('contact'),
    name: Joi.string().trim().required().min(2).max(100).messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required',
    }),
    phone: Joi.string().optional().allow('').trim(),
    subject: Joi.string().optional().allow('').trim().max(150),
    company: Joi.string().optional().allow('').trim().max(150),
    service: Joi.string().optional().allow('').trim().max(200),
    preferredDate: preferredDemoDateSchema.optional(),
    preferredTime: Joi.string().valid('10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM').optional(),
    message: Joi.string().required().min(10).max(5000).messages({
        'string.min': 'Message must be at least 10 characters',
        'string.max': 'Message cannot exceed 5000 characters',
        'any.required': 'Message is required',
    }),
}).when(Joi.object({ requestType: Joi.valid('demo') }).unknown(), {
    then: Joi.object({
        service: Joi.string().trim().required().max(200),
        preferredDate: preferredDemoDateSchema.required(),
        preferredTime: Joi.string().valid('10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM').required(),
    }),
});

// Blog Validation
exports.blogSchema = Joi.object({
    title: Joi.string().trim().required().min(5).max(200).messages({
        'string.min': 'Title must be at least 5 characters',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required',
    }),
    slug: Joi.string().trim().lowercase().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(200).optional().messages({
        'string.pattern.base': 'Slug can contain lowercase letters, numbers, and single hyphens only',
    }),
    metaTitle: Joi.string().trim().allow('').max(60),
    metaDescription: Joi.string().trim().allow('').max(160),
    focusKeyword: Joi.string().trim().allow('').max(80),
    canonicalUrl: Joi.string().trim().uri({ scheme: ['http', 'https'] }).allow('').max(500),
    ogTitle: Joi.string().trim().allow('').max(100),
    ogDescription: Joi.string().trim().allow('').max(200),
    imageAlt: Joi.string().trim().allow('').max(200),
    noIndex: Joi.boolean().optional(),
    seoKeywords: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim().max(80)).max(20),
        Joi.string().trim().allow('').max(500)
    ).optional(),
    description: Joi.string().trim().optional().max(500).messages({
        'string.max': 'Description cannot exceed 500 characters',
    }),
    content: Joi.string().required().min(20).messages({
        'string.min': 'Content must be at least 20 characters',
        'any.required': 'Content is required',
    }),
    category: Joi.string()
        .required()
        .valid('web development', 'mobile development', 'design', 'cloud devops',
            'seo marketing', 'e-commerce', 'cybersecurity', 'artificial intelligence',
            'business', 'technology trends', 'other')
        .messages({
            'any.only': 'Invalid category selected',
            'any.required': 'Category is required',
        }),
    tags: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string().trim()
    ).optional(),
    author: Joi.string().trim().optional().max(100),
    image: Joi.string().optional().allow(null).allow(''),
    date: Joi.date().optional(),
    isPublished: Joi.boolean().optional(),
});

// Service Validation
const serviceFeatureCardSchema = Joi.object({
    title: Joi.string().trim().required().min(1).max(80),
    description: Joi.string().trim().required().min(1).max(240),
});

const topFeatureCardSchema = Joi.object({
    title: Joi.string().trim().required().min(1).max(80),
    description: Joi.string().trim().required().min(1).max(240),
    image: Joi.string().allow('', null).optional(),
});

const serviceFeaturesSchema = Joi.array().items(
    Joi.string().trim().min(1),
    serviceFeatureCardSchema
).min(5).max(20);

exports.serviceSchema = Joi.object({
    title: Joi.string().trim().required().min(3).max(100).messages({
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required',
    }),
    description: Joi.string().required().min(10).max(2000).messages({
        'string.min': 'Description must be at least 10 characters',
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Description is required',
    }),
    category: Joi.string().trim().optional().max(50),
    icon: Joi.string().optional().allow(''),
    price: Joi.number().optional().min(0),
    duration: Joi.string().optional().allow(''),
    features: serviceFeaturesSchema.optional(),
    topFeatures: Joi.array().items(topFeatureCardSchema).min(3).max(20).optional(),
    topFeatureImageIndexes: Joi.array().items(Joi.number().integer().min(0).max(19)).optional(),
    benefits: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string().trim()
    ).optional(),
    isActive: Joi.boolean().optional(),
});

exports.createServiceSchema = exports.serviceSchema
    .fork(['features'], () => Joi.array().items(serviceFeatureCardSchema).min(5).max(20).required())
    .fork(['topFeatures'], () => Joi.array().items(topFeatureCardSchema).min(3).max(20).required());

exports.updateServiceSchema = exports.serviceSchema.fork(
    ['title', 'description'],
    (schema) => schema.optional()
);

// Testimonial Validation
exports.testimonialSchema = Joi.object({
    name: Joi.string().trim().required().min(2).max(100).messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required',
    }),
    company: Joi.string().optional().allow('').trim().max(100),
    review: Joi.string().required().min(10).max(1000).messages({
        'string.min': 'Review must be at least 10 characters',
        'string.max': 'Review cannot exceed 1000 characters',
        'any.required': 'Review is required',
    }),
    rating: Joi.number().required().min(1).max(5).messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot exceed 5',
        'any.required': 'Rating is required',
    }),
    position: Joi.string().optional().allow('').trim().max(100),
    isActive: Joi.boolean().optional(),
});

/**
 * Validation Middleware
 */
exports.validate = (schema) => {
    return (req, res, next) => {
        for (const field of ['features', 'topFeatures', 'topFeatureImageIndexes', 'benefits']) {
            if (typeof req.body[field] === 'string') {
                try {
                    const parsed = JSON.parse(req.body[field]);
                    if (Array.isArray(parsed)) {
                        req.body[field] = parsed;
                    }
                } catch {
                    if (field === 'features' || field === 'topFeatureImageIndexes') {
                        req.body[field] = req.body[field]
                            .split(',')
                            .map((item) => field === 'topFeatureImageIndexes' ? Number(item) : item.trim())
                            .filter((item) => item !== '');
                    }
                }
            }
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
        }

        // Replace req.body with validated and cleaned data
        req.body = value;
        next();
    };
};
