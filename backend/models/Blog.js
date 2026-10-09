const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
        },
        metaTitle: {
            type: String,
            trim: true,
            maxlength: 60,
            default: '',
        },
        metaDescription: {
            type: String,
            trim: true,
            maxlength: 160,
            default: '',
        },
        focusKeyword: {
            type: String,
            trim: true,
            maxlength: 80,
            default: '',
        },
        canonicalUrl: {
            type: String,
            trim: true,
            maxlength: 500,
            default: '',
        },
        ogTitle: {
            type: String,
            trim: true,
            maxlength: 100,
            default: '',
        },
        ogDescription: {
            type: String,
            trim: true,
            maxlength: 200,
            default: '',
        },
        imageAlt: {
            type: String,
            trim: true,
            maxlength: 200,
            default: '',
        },
        noIndex: {
            type: Boolean,
            default: false,
        },
        seoKeywords: [{
            type: String,
            trim: true,
        }],
        description: {
            type: String,
            default: '',
        },
        content: {
            type: String,
            required: [true, 'Blog content is required'],
        },
        image: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            required: [true, 'Blog category is required'],
            enum: ['web development', 'mobile development', 'design', 'cloud devops', 'seo marketing', 'e-commerce', 'cybersecurity', 'artificial intelligence', 'business', 'technology trends', 'other'],
        },
        tags: [{
            type: String,
            trim: true,
        }],
        author: {
            type: String,
            default: 'Arviora Solution',
        },
        date: {
            type: Date,
            default: Date.now,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const slugify = (value) => value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

blogSchema.pre('validate', function () {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title) || `blog-${this._id}`;
    } else if (this.isModified('title') && !this.isModified('slug')) {
        this.slug = slugify(this.title) || `blog-${this._id}`;
    }
});

module.exports = mongoose.model('Blog', blogSchema);
