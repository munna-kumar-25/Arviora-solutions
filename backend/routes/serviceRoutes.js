const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const authMiddleware = require('../middleware/authMiddleware');
const { validate, updateServiceSchema, createServiceSchema } = require('../utils/validators');
const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} = require('../controllers/serviceController');

/**
 * @route   GET /api/services
 * @desc    Get all services (Public)
 * @query   category, isActive (filters)
 * @access  Public
 */
router.get('/', getAllServices);

/**
 * @route   GET /api/services/:id
 * @desc    Get service by ID (Public)
 * @access  Public
 */
router.get('/:id', getServiceById);

/**
 * @route   POST /api/services
 * @desc    Create new service
 * @access  Private (Admin only)
 */
router.post(
    '/',
    authMiddleware,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'topFeatureImages', maxCount: 20 },
    ]),
    validate(createServiceSchema),
    createService
);

/**
 * @route   PUT /api/services/:id
 * @desc    Update service
 * @access  Private (Admin only)
 */
router.put(
    '/:id',
    authMiddleware,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'topFeatureImages', maxCount: 20 },
    ]),
    validate(updateServiceSchema),
    updateService
);

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete service
 * @access  Private (Admin only)
 */
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;
