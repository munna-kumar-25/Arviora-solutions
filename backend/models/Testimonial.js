const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Client name is required'],
            trim: true,
        },
        company: {
            type: String,
            default: null,
            trim: true,
        },
        review: {
            type: String,
            required: [true, 'Review is required'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
        },
        image: {
            type: String,
            default: null,
        },
        position: {
            type: String,
            default: null,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
