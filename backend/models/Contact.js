const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            default: null,
            trim: true,
        },
        subject: {
            type: String,
            default: null,
            trim: true,
        },
        requestType: {
            type: String,
            enum: ['contact', 'demo'],
            default: 'contact',
        },
        company: {
            type: String,
            default: null,
            trim: true,
        },
        service: {
            type: String,
            default: null,
            trim: true,
        },
        preferredDate: {
            type: String,
            default: null,
        },
        preferredTime: {
            type: String,
            default: null,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isReplied: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
