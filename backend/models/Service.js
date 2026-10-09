const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Service title is required'],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: [true, 'Service description is required'],
        },
        icon: {
            type: String, // File path or URL
            default: null,
        },
        image: {
            type: String, // File path or URL
            default: null,
        },
        price: {
            type: String,
            default: null,
        },
        duration: {
            type: String,
            default: null,
        },
        features: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
        topFeatures: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },
        benefits: [{
            type: String,
        }],
        category: {
            type: String,
            enum: ['mobile', 'web', 'marketing', 'design', 'other'],
            default: 'other',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
