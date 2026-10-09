import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ThemeContext } from '../context/ThemeContext';
import { getImageUrl } from '../services/api';

const API_URL = process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production'
        ? 'https://arviora-solutions-2.onrender.com/api'
        : 'http://localhost:5000/api'
);

export const ContactForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear validation error for this field when user starts typing
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = 'Please provide a valid email address';
        }

        if (!formData.message.trim()) {
            errors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters';
        } else if (formData.message.length > 5000) {
            errors.message = 'Message cannot exceed 5000 characters';
        }

        if (formData.subject.trim().length > 150) {
            errors.subject = 'Subject cannot exceed 150 characters';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setValidationErrors({});

        // Client-side validation
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setLoading(false);
            return;
        }

        try {
            // Send to backend API
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle validation errors from backend
                if (data.errors && Array.isArray(data.errors)) {
                    const backendErrors = {};
                    data.errors.forEach(err => {
                        backendErrors[err.field] = err.message;
                    });
                    setValidationErrors(backendErrors);
                    setError('Please correct the validation errors below');
                } else {
                    setError(data.message || 'Failed to send message');
                }
                setLoading(false);
                return;
            }

            // Call the onSubmit callback
            if (onSubmit) {
                onSubmit(formData);
            }

            // Reset form
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
            <div>
                <label className="block text-black dark:text-white font-bold mb-2">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none transition ${validationErrors.name
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-indigo-600 dark:focus:border-brand-secondary'
                        }`}
                    placeholder="Your Name"
                    required
                />
                {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.name}</p>
                )}
            </div>

            <div>
                <label className="block text-black dark:text-white font-bold mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none transition ${validationErrors.email
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-indigo-600 dark:focus:border-brand-secondary'
                        }`}
                    placeholder="your@email.com"
                    required
                />
                {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.email}</p>
                )}
            </div>

            <div>
                <label className="block text-black dark:text-white font-bold mb-2">Phone (Optional)</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-brand-secondary transition"
                    placeholder="Your phone number"
                />
            </div>

            <div>
                <label className="block text-black dark:text-white font-bold mb-2">Subject</label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none transition ${validationErrors.subject
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-indigo-600 dark:focus:border-brand-secondary'
                        }`}
                    placeholder="Subject"
                    required
                />
                {validationErrors.subject && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.subject}</p>
                )}
            </div>

            <div>
                <label className="block text-black dark:text-white font-bold mb-2">
                    Message<span className="text-gray-500 text-sm font-normal"> (min 10, max 5000 characters)</span>
                </label>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 border-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:outline-none transition resize-none ${validationErrors.message
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 dark:border-gray-700 focus:border-indigo-600 dark:focus:border-brand-secondary'
                        }`}
                    placeholder="Your message..."
                    required
                ></textarea>
                {validationErrors.message && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">{formData.message.length}/5000 characters</p>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Sending...' : 'Send Message'}
            </motion.button>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
                >
                    ❌ {error}
                </motion.div>
            )}

            {submitted && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg"
                >
                    ✓ Message sent successfully! We'll contact you soon.
                </motion.div>
            )}
        </motion.form>
    );
};

const parseServiceFeatureValue = (value, depth = 0) => {
    if (typeof value !== 'string' || depth > 2) return value;
    try {
        return parseServiceFeatureValue(JSON.parse(value), depth + 1);
    } catch {
        return value;
    }
};

const createServiceFeatures = (service) => {
    const parsed = parseServiceFeatureValue(service?.features);
    const items = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
    const features = items
        .flatMap((item) => {
            const parsedItem = parseServiceFeatureValue(item);
            return Array.isArray(parsedItem) ? parsedItem : [parsedItem];
        })
        .map((feature) => (
            typeof feature === 'string'
                ? { title: feature, description: '' }
                : { title: feature?.title || '', description: feature?.description || '' }
        ))
        .filter((feature) => feature.title || feature.description);

    while (features.length < 5) {
        features.push({ title: '', description: '' });
    }

    return features;
};

const createTopFeatureCards = (service) => {
    const parsed = parseServiceFeatureValue(service?.topFeatures);
    const items = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
    const cards = items
        .flatMap((item) => {
            const parsedItem = parseServiceFeatureValue(item);
            return Array.isArray(parsedItem) ? parsedItem : [parsedItem];
        })
        .map((feature) => ({
            title: typeof feature === 'string' ? feature : feature?.title || '',
            description: typeof feature === 'object' ? feature?.description || '' : '',
            image: typeof feature === 'object' ? feature?.image || null : null,
            imageFile: null,
            imagePreview: typeof feature === 'object' && feature?.image ? getImageUrl(feature.image) : null,
        }))
        .filter((feature) => feature.title || feature.description || feature.image);

    while (cards.length < 3) {
        cards.push({ title: '', description: '', image: null, imageFile: null, imagePreview: null });
    }

    return cards;
};

const createServiceFormData = (service) => ({
    title: service?.title || '',
    description: service?.description || '',
    price: service?.price ?? '',
    category: service?.category || '',
    features: createServiceFeatures(service),
    topFeatures: createTopFeatureCards(service),
    image: service?.image || null,
    imagePreview: service?.image ? getImageUrl(service.image) : null,
});

export const ServiceForm = ({ initial, onSubmit, onCancel }) => {
    const { isDark } = useContext(ThemeContext);
    const [formData, setFormData] = useState(() => createServiceFormData(initial));
    const topFeaturePreviewUrls = useRef(new Set());

    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData(createServiceFormData(initial));
        setValidationErrors({});
        setError('');
    }, [initial]);

    useEffect(() => () => {
        if (formData.imagePreview?.startsWith('blob:')) {
            URL.revokeObjectURL(formData.imagePreview);
        }
    }, [formData.imagePreview]);

    useEffect(() => () => {
        topFeaturePreviewUrls.current.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
        topFeaturePreviewUrls.current.clear();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const handleFeatureChange = (index, field, value) => {
        setFormData((current) => ({
            ...current,
            features: current.features.map((feature, featureIndex) => (
                featureIndex === index ? { ...feature, [field]: value } : feature
            )),
        }));
        setValidationErrors((current) => ({
            ...current,
            features: '',
            [`feature-${index}-${field}`]: '',
        }));
    };

    const addFeature = () => {
        if (formData.features.length >= 20) return;
        setFormData((current) => ({
            ...current,
            features: [...current.features, { title: '', description: '' }],
        }));
        setValidationErrors((current) => ({ ...current, features: '' }));
    };

    const removeFeature = (index) => {
        setFormData((current) => ({
            ...current,
            features: current.features.filter((_, featureIndex) => featureIndex !== index),
        }));
        setValidationErrors((current) => ({ ...current, features: '' }));
    };

    const handleTopFeatureChange = (index, field, value) => {
        setFormData((current) => ({
            ...current,
            topFeatures: current.topFeatures.map((feature, featureIndex) => (
                featureIndex === index ? { ...feature, [field]: value } : feature
            )),
        }));
        setValidationErrors((current) => ({
            ...current,
            topFeatures: '',
            [`topFeature-${index}-${field}`]: '',
        }));
    };

    const addTopFeature = () => {
        if (formData.topFeatures.length >= 20) return;
        setFormData((current) => ({
            ...current,
            topFeatures: [...current.topFeatures, { title: '', description: '', image: null, imageFile: null, imagePreview: null }],
        }));
        setValidationErrors((current) => ({ ...current, topFeatures: '' }));
    };

    const removeTopFeature = (index) => {
        if (formData.topFeatures.length <= 3) return;
        const previewUrl = formData.topFeatures[index]?.imagePreview;
        if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
            topFeaturePreviewUrls.current.delete(previewUrl);
        }
        setFormData((current) => ({
            ...current,
            topFeatures: current.topFeatures.filter((_, featureIndex) => featureIndex !== index),
        }));
        setValidationErrors((current) => ({ ...current, topFeatures: '' }));
    };

    const handleTopFeatureImageChange = (index, event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please choose a JPG, PNG, WEBP, or GIF top feature image.');
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Each top feature image must be 5 MB or smaller.');
            event.target.value = '';
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        topFeaturePreviewUrls.current.add(previewUrl);
        const previousPreview = formData.topFeatures[index]?.imagePreview;
        if (previousPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(previousPreview);
            topFeaturePreviewUrls.current.delete(previousPreview);
        }
        setFormData((current) => ({
            ...current,
            topFeatures: current.topFeatures.map((feature, featureIndex) => (
                featureIndex === index
                    ? { ...feature, imageFile: file, imagePreview: previewUrl }
                    : feature
            )),
        }));
        setValidationErrors((current) => ({
            ...current,
            [`topFeature-${index}-image`]: '',
        }));
        setError('');
        event.target.value = '';
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Please choose a JPG, PNG, WEBP, or GIF image.');
            e.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be 5 MB or smaller.');
            e.target.value = '';
            return;
        }

        setError('');
        setFormData((current) => ({
            ...current,
            image: file,
            imagePreview: URL.createObjectURL(file),
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title.trim()) {
            errors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            errors.title = 'Title must be at least 3 characters';
        } else if (formData.title.length > 100) {
            errors.title = 'Title cannot exceed 100 characters';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            errors.description = 'Description must be at least 10 characters';
        } else if (formData.description.length > 2000) {
            errors.description = 'Description cannot exceed 2000 characters';
        }

        if (formData.features.length < 5) {
            errors.features = 'Please add at least 5 key feature cards.';
        } else {
            formData.features.forEach((feature, index) => {
                if (!feature.title.trim()) {
                    errors[`feature-${index}-title`] = 'Feature title is required.';
                }
                if (!feature.description.trim()) {
                    errors[`feature-${index}-description`] = 'Short description is required.';
                }
            });
        }

        if (formData.topFeatures.length < 3) {
            errors.topFeatures = 'Please add at least 3 Explore Your Top Features cards.';
        } else {
            formData.topFeatures.forEach((feature, index) => {
                if (!feature.title.trim()) {
                    errors[`topFeature-${index}-title`] = 'Feature title is required.';
                }
                if (!feature.description.trim()) {
                    errors[`topFeature-${index}-description`] = 'Short description is required.';
                }
                if (!feature.image && !feature.imageFile) {
                    errors[`topFeature-${index}-image`] = 'Please upload an image for this feature card.';
                }
            });
        }

        if (formData.price && isNaN(formData.price)) {
            errors.price = 'Price must be a number';
        } else if (formData.price && parseFloat(formData.price) < 0) {
            errors.price = 'Price cannot be negative';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setValidationErrors({});

        // Client-side validation
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setLoading(false);
            return;
        }

        try {
            await onSubmit(formData);
        } catch (err) {
            // Handle backend validation errors
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                const backendErrors = {};
                err.response.data.errors.forEach(err => {
                    backendErrors[err.field] = err.message;
                });
                setValidationErrors(backendErrors);
                setError('Please correct the validation errors below');
            } else {
                setError(err.message || 'Failed to save service. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 p-6 rounded-lg shadow transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {error && (
                <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30 border border-red-700/50 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    ❌ {error}
                </div>
            )}

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${validationErrors.title
                        ? isDark ? 'bg-gray-700 border-red-500 text-white' : 'bg-white border-red-500 text-black'
                        : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        }`}
                    required
                />
                {validationErrors.title && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.title}</p>
                )}
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Description <span className="text-gray-500 text-sm font-normal">(10-2000 characters)</span></label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none resize-none transition-colors ${validationErrors.description
                        ? isDark ? 'bg-gray-700 border-red-500 text-white' : 'bg-white border-red-500 text-black'
                        : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        }`}
                    required
                ></textarea>
                {validationErrors.description && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.description}</p>
                )}
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formData.description.length}/2000 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                    >
                        <option value="">-- Select Category --</option>
                        <option value="mobile">Mobile Development</option>
                        <option value="web">Web Development</option>
                        <option value="marketing">Marketing</option>
                        <option value="design">Design</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Price (Optional)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${validationErrors.price
                            ? isDark ? 'bg-gray-700 border-red-500 text-white' : 'bg-white border-red-500 text-black'
                            : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                            }`}
                        placeholder="0.00"
                    />
                    {validationErrors.price && (
                        <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.price}</p>
                    )}
                </div>
            </div>

            <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <label className={`block font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Key Feature Cards <span className="text-sm font-normal text-gray-500">(minimum 5)</span>
                        </label>
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Add a short title and description for each feature card.
                        </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${formData.features.length >= 5 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                        {formData.features.length} / 5 minimum
                    </span>
                </div>

                <div className="space-y-4">
                    {formData.features.map((feature, index) => (
                        <div
                            key={index}
                            className={`rounded-xl border p-4 ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'}`}
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    Feature {index + 1}
                                </h3>
                                {formData.features.length > 5 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(event) => handleFeatureChange(index, 'title', event.target.value)}
                                        maxLength={80}
                                        aria-label={`Feature ${index + 1} title`}
                                        placeholder="Feature title"
                                        className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                                    />
                                    {validationErrors[`feature-${index}-title`] && (
                                        <p className="mt-1 text-sm text-red-500">{validationErrors[`feature-${index}-title`]}</p>
                                    )}
                                </div>
                                <div>
                                    <textarea
                                        value={feature.description}
                                        onChange={(event) => handleFeatureChange(index, 'description', event.target.value)}
                                        maxLength={240}
                                        rows={2}
                                        aria-label={`Feature ${index + 1} short description`}
                                        placeholder="Short description of this feature"
                                        className={`w-full resize-y rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                                    />
                                    <div className="mt-1 flex justify-between gap-2">
                                        {validationErrors[`feature-${index}-description`] ? (
                                            <p className="text-sm text-red-500">{validationErrors[`feature-${index}-description`]}</p>
                                        ) : <span />}
                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {feature.description.length}/240
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {validationErrors.features && (
                    <p className="mt-2 text-sm text-red-500">{validationErrors.features}</p>
                )}
                <button
                    type="button"
                    onClick={addFeature}
                    disabled={formData.features.length >= 20}
                    className={`mt-3 rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'border-indigo-400 text-indigo-300 hover:bg-indigo-400/10' : 'border-indigo-600 text-indigo-700 hover:bg-indigo-50'}`}
                >
                    {formData.features.length >= 20 ? 'Maximum 20 feature cards' : '+ Add feature card'}
                </button>
            </div>

            <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Explore Your Top Features <span className="text-sm font-normal text-gray-500">(minimum 3)</span>
                        </h2>
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Each card needs a title, short description, and its own image.
                        </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${formData.topFeatures.length >= 3 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                        {formData.topFeatures.length} / 3 minimum
                    </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {formData.topFeatures.map((feature, index) => (
                        <article
                            key={index}
                            className={`overflow-hidden rounded-xl border ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-white'}`}
                        >
                            {feature.imagePreview ? (
                                <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={feature.imagePreview}
                                        alt={`${feature.title || `Feature ${index + 1}`} preview`}
                                        className="h-full w-full p-3 object-contain object-center"
                                    />
                                </div>
                            ) : (
                                <div className={`flex h-40 items-center justify-center text-sm ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                    Upload an image to preview this feature card
                                </div>
                            )}
                            <div className={`border-y px-4 py-3 ${isDark ? 'border-indigo-400/20 bg-indigo-400/10' : 'border-indigo-100 bg-indigo-50/70'}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className={`font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-950'}`}>
                                        {feature.title || `Top Feature ${index + 1}`}
                                    </h3>
                                    {formData.topFeatures.length > 3 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTopFeature(index)}
                                            className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3 p-4">
                                <div>
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(event) => handleTopFeatureChange(index, 'title', event.target.value)}
                                        maxLength={80}
                                        aria-label={`Top feature ${index + 1} title`}
                                        placeholder="Feature title"
                                        className={`w-full rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                                    />
                                    {validationErrors[`topFeature-${index}-title`] && (
                                        <p className="mt-1 text-sm text-red-500">{validationErrors[`topFeature-${index}-title`]}</p>
                                    )}
                                </div>
                                <div>
                                    <textarea
                                        value={feature.description}
                                        onChange={(event) => handleTopFeatureChange(index, 'description', event.target.value)}
                                        maxLength={240}
                                        rows={3}
                                        aria-label={`Top feature ${index + 1} short description`}
                                        placeholder="Write a short description"
                                        className={`w-full resize-y rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`}
                                    />
                                    <div className="mt-1 flex justify-between gap-2">
                                        {validationErrors[`topFeature-${index}-description`] ? (
                                            <p className="text-sm text-red-500">{validationErrors[`topFeature-${index}-description`]}</p>
                                        ) : <span />}
                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {feature.description.length}/240
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor={`top-feature-image-${index}`}
                                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed px-3 py-2.5 text-sm transition hover:border-indigo-500 ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'}`}
                                    >
                                        <span>{feature.imagePreview ? 'Choose another image' : 'Upload feature image'}</span>
                                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Browse</span>
                                        <input
                                            id={`top-feature-image-${index}`}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            onChange={(event) => handleTopFeatureImageChange(index, event)}
                                            className="sr-only"
                                        />
                                    </label>
                                    {validationErrors[`topFeature-${index}-image`] && (
                                        <p className="mt-1 text-sm text-red-500">{validationErrors[`topFeature-${index}-image`]}</p>
                                    )}
                                    <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        JPG, PNG, WEBP, or GIF · up to 5 MB
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                {validationErrors.topFeatures && (
                    <p className="mt-2 text-sm text-red-500">{validationErrors.topFeatures}</p>
                )}
                <button
                    type="button"
                    onClick={addTopFeature}
                    disabled={formData.topFeatures.length >= 20}
                    className={`mt-3 rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDark ? 'border-indigo-400 text-indigo-300 hover:bg-indigo-400/10' : 'border-indigo-600 text-indigo-700 hover:bg-indigo-50'}`}
                >
                    {formData.topFeatures.length >= 20 ? 'Maximum 20 top feature cards' : '+ Add top feature card'}
                </button>
            </div>

            <div>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <label htmlFor="service-image-upload" className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        Service Image <span className="font-normal text-gray-500">(optional)</span>
                    </label>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        JPG, PNG, WEBP, or GIF · up to 5 MB
                    </span>
                </div>
                {formData.imagePreview && (
                    <div className="relative mb-3 h-52 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
                        <img
                            src={formData.imagePreview}
                            alt="Service image preview"
                            className="h-full w-full object-cover object-center"
                        />
                        <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            Preview · same crop as service cards
                        </span>
                    </div>
                )}
                <label
                    htmlFor="service-image-upload"
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-dashed px-5 py-4 transition hover:border-indigo-500 ${isDark ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700' : 'border-gray-300 bg-gray-50 hover:bg-indigo-50/50'}`}
                >
                    <span>
                        <span className={`block font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            {formData.imagePreview ? 'Choose a different image' : 'Upload a service image'}
                        </span>
                        <span className={`mt-1 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Landscape images work best; the card preview updates instantly.
                        </span>
                    </span>
                    <span className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                        Browse
                    </span>
                    <input
                        id="service-image-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageChange}
                        className="sr-only"
                    />
                </label>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (initial ? 'Updating...' : 'Adding...') : (initial ? 'Update Service' : 'Add Service')}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className={`flex-1 btn-secondary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

const createBlogSlug = (value = '') => value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getBlogKeywordInput = (blog) => {
    const value = blog.seoKeywords?.length ? blog.seoKeywords : blog.tags || [];
    return Array.isArray(value) ? value.join(', ') : value;
};

const blogCategories = [
    ['web development', 'Web Development'],
    ['mobile development', 'Mobile Development'],
    ['design', 'Design & UX'],
    ['cloud devops', 'Cloud & DevOps'],
    ['seo marketing', 'SEO & Marketing'],
    ['e-commerce', 'E-Commerce'],
    ['cybersecurity', 'Cybersecurity'],
    ['artificial intelligence', 'Artificial Intelligence'],
    ['business', 'Business & Startup'],
    ['technology trends', 'Technology Trends'],
    ['other', 'Other'],
];

export const BlogForm = ({ initial, onSubmit, onCancel }) => {
    const { isDark } = useContext(ThemeContext);
    const [formData, setFormData] = useState(
        initial ? {
            ...initial,
            slug: initial.slug || createBlogSlug(initial.title),
            seoKeywords: getBlogKeywordInput(initial),
            date: initial.date ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            imagePreview: initial.imagePreview || (initial.image ? getImageUrl(initial.image) : null),
        } : {
            title: '',
            slug: '',
            content: '',
            image: null,
            imagePreview: null,
            date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
            views: 0,
            category: 'other',
            seoKeywords: '',
            focusKeyword: '',
            metaTitle: '',
            metaDescription: '',
            canonicalUrl: '',
            ogTitle: '',
            ogDescription: '',
            imageAlt: '',
            noIndex: false,
        }
    );

    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initial?.slug));
    const plainTextContent = (formData.content || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();
    const keywords = (formData.seoKeywords || '').split(',').map((keyword) => keyword.trim()).filter(Boolean);
    const descriptionWords = plainTextContent ? plainTextContent.split(/\s+/).length : 0;
    const focusKeyword = (formData.focusKeyword || keywords[0] || '').trim();
    const titleIncludesKeyword = focusKeyword && formData.title.toLowerCase().includes(focusKeyword.toLowerCase());
    const contentIncludesKeyword = focusKeyword && plainTextContent.toLowerCase().includes(focusKeyword.toLowerCase());
    const slugPreview = formData.slug || createBlogSlug(formData.title);
    const effectiveMetaTitle = formData.metaTitle || formData.title;
    const effectiveMetaDescription = formData.metaDescription || plainTextContent.slice(0, 160);
    const inputClass = `w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-black placeholder-gray-500'}`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => {
            const updated = { ...current, [name]: value };
            if (name === 'title' && !slugManuallyEdited) {
                updated.slug = createBlogSlug(value);
            }
            return updated;
        });
        if (name === 'slug') setSlugManuallyEdited(true);
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const handleDescriptionChange = (content) => {
        setFormData((current) => ({ ...current, content }));
        if (validationErrors.content) {
            setValidationErrors({ ...validationErrors, content: '' });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData({
                    ...formData,
                    image: file,
                    imagePreview: event.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || plainTextContent.length < 20) {
            setError('Add a title and write at least 20 characters in the description.');
            return;
        }
        setLoading(true);
        setError('');
        setValidationErrors({});

        try {
            const keywordsArray = [...new Set(keywords.map((keyword) => keyword.toLowerCase()))];
            const description = plainTextContent.slice(0, 500);
            await onSubmit({
                ...formData,
                slug: formData.slug || createBlogSlug(formData.title),
                description,
                metaTitle: (formData.metaTitle || formData.title).slice(0, 60),
                metaDescription: (formData.metaDescription || description).slice(0, 160),
                focusKeyword,
                canonicalUrl: formData.canonicalUrl.trim(),
                ogTitle: (formData.ogTitle || formData.metaTitle || formData.title).slice(0, 100),
                ogDescription: (formData.ogDescription || formData.metaDescription || description).slice(0, 200),
                seoKeywords: keywordsArray,
                tags: keywordsArray,
                noIndex: Boolean(formData.noIndex),
                category: formData.category,
                author: initial?.author || 'Arviora Solutions',
                isPublished: initial?.isPublished ?? true,
            });
        } catch (err) {
            // Handle backend validation errors
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                const backendErrors = {};
                err.response.data.errors.forEach(error => {
                    backendErrors[error.field] = error.message;
                });
                setValidationErrors(backendErrors);
                setError('Please correct the validation errors below');
            } else {
                setError(err.message || 'Failed to save blog. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 p-6 rounded-lg shadow transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Blog title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={200}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                    required
                />
            </div>

            <div>
                <label htmlFor="blog-category" className={`mb-2 block font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Category</label>
                <select
                    id="blog-category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className={inputClass}
                    required
                >
                    <option value="" disabled>Select a category</option>
                    {blogCategories.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Publish date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:border-indigo-600 ${isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'}`}
                        required
                    />
                </div>
                <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Views</label>
                    <div className={`rounded-lg border px-4 py-2 ${isDark ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-600'}`}>
                        {Number(initial?.views || 0).toLocaleString()}
                    </div>
                </div>
            </div>

            <div>
                <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Image alt text</label>
                <input
                    type="text"
                    name="imageAlt"
                    value={formData.imageAlt || ''}
                    onChange={handleChange}
                    maxLength={200}
                    placeholder={formData.title || 'Describe the blog image'}
                    className={inputClass}
                />
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Describe the image for screen readers and image search.</p>
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Blog Image</label>
                <div className="relative">
                    {formData.imagePreview && (
                        <div className="mb-3 relative">
                            <img src={formData.imagePreview} alt="Blog Preview" className="w-full h-48 object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600 transition"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <label className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-indigo-600 transition ${isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'}`}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{formData.imagePreview ? 'Change Image' : 'Upload Blog Image'}</span>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Click to select or drag & drop</p>
                    </label>
                </div>
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Description</label>
                <ReactQuill
                    theme="snow"
                    value={formData.content || ''}
                    onChange={handleDescriptionChange}
                    modules={{
                        toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ align: [] }],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['blockquote', 'link'],
                            ['clean'],
                        ],
                    }}
                    formats={['header', 'bold', 'italic', 'underline', 'strike', 'align', 'list', 'blockquote', 'link']}
                    className={`blog-description-editor ${isDark ? 'blog-description-editor-dark' : ''}`}
                    placeholder="Write a helpful, detailed article. Use headings and your keywords naturally."
                    aria-label="Blog description rich-text editor"
                />
                <div className={`mt-2 flex flex-wrap justify-between gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>{descriptionWords} words</span>
                    <span>{plainTextContent.length} characters</span>
                </div>
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Keywords</label>
                <input
                    type="text"
                    name="seoKeywords"
                    value={formData.seoKeywords || ''}
                    onChange={handleChange}
                    maxLength={500}
                    placeholder="web development, SEO, content marketing"
                    className={`w-full rounded-lg border px-4 py-2 focus:outline-none focus:border-indigo-600 ${isDark ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-black'}`}
                />
                <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Separate keywords with commas. Use them naturally in the title and description.
                </p>
                {keywords.length > 0 && (
                    <div className={`mt-3 flex flex-wrap gap-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className={titleIncludesKeyword ? 'text-green-600' : 'text-amber-600'}>
                            {titleIncludesKeyword ? '✓' : '○'} Keyword in title
                        </span>
                        <span className={contentIncludesKeyword ? 'text-green-600' : 'text-amber-600'}>
                            {contentIncludesKeyword ? '✓' : '○'} Keyword in description
                        </span>
                    </div>
                )}
            </div>

            <details className={`rounded-xl border p-5 ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'}`} open>
                <summary className={`cursor-pointer text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    SEO settings
                </summary>
                <p className={`mb-5 mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Customize how this post appears in search results and social shares. Leave optional fields blank to use automatic values.
                </p>

                <div className="space-y-5">
                    <div>
                        <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>SEO URL slug</label>
                        <div className={`flex overflow-hidden rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}>
                            <span className={`flex items-center border-r px-3 text-sm ${isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>/blog/</span>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug || ''}
                                onChange={handleChange}
                                maxLength={200}
                                pattern="[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*"
                                title="Use letters, numbers, and hyphens only."
                                placeholder={createBlogSlug(formData.title) || 'blog-post-url'}
                                className={`w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-black placeholder-gray-500'}`}
                            />
                        </div>
                        <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Preview: /blog/{slugPreview || 'your-post-slug'}
                        </p>
                    </div>

                    <div>
                        <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Meta title</label>
                        <input
                            type="text"
                            name="metaTitle"
                            value={formData.metaTitle || ''}
                            onChange={handleChange}
                            maxLength={60}
                            placeholder={formData.title || 'Search result title'}
                            className={inputClass}
                        />
                        <p className={`mt-1 text-xs ${effectiveMetaTitle.length > 60 ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {effectiveMetaTitle.length}/60 characters
                        </p>
                    </div>

                    <div>
                        <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Meta description</label>
                        <textarea
                            name="metaDescription"
                            value={formData.metaDescription || ''}
                            onChange={handleChange}
                            maxLength={160}
                            rows={3}
                            placeholder="A concise summary for search results (generated from Description when left blank)."
                            className={`${inputClass} resize-y`}
                        />
                        <p className={`mt-1 text-xs ${effectiveMetaDescription.length > 160 ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {effectiveMetaDescription.length}/160 characters
                        </p>
                    </div>

                    <div>
                        <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Focus keyword</label>
                        <input
                            type="text"
                            name="focusKeyword"
                            value={formData.focusKeyword || ''}
                            onChange={handleChange}
                            maxLength={80}
                            placeholder={keywords[0] || 'Main topic or phrase'}
                            className={inputClass}
                        />
                        {focusKeyword && (
                            <p className={`mt-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <span className={titleIncludesKeyword ? 'text-green-600' : 'text-amber-600'}>{titleIncludesKeyword ? '✓' : '○'} In title</span>
                                <span className="mx-3">·</span>
                                <span className={contentIncludesKeyword ? 'text-green-600' : 'text-amber-600'}>{contentIncludesKeyword ? '✓' : '○'} In description</span>
                            </p>
                        )}
                    </div>

                    <div>
                        <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Canonical URL (optional)</label>
                        <input
                            type="url"
                            name="canonicalUrl"
                            value={formData.canonicalUrl || ''}
                            onChange={handleChange}
                            maxLength={500}
                            placeholder={`https://example.com/blog/${slugPreview || 'your-post-slug'}`}
                            className={inputClass}
                        />
                        <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Defaults to this article's public URL.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Social share title</label>
                            <input
                                type="text"
                                name="ogTitle"
                                value={formData.ogTitle || ''}
                                onChange={handleChange}
                                maxLength={100}
                                placeholder={effectiveMetaTitle}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={`mb-2 block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Social share description</label>
                            <textarea
                                name="ogDescription"
                                value={formData.ogDescription || ''}
                                onChange={handleChange}
                                maxLength={200}
                                rows={2}
                                placeholder={effectiveMetaDescription}
                                className={`${inputClass} resize-y`}
                            />
                        </div>
                    </div>

                    <label className={`flex items-start gap-3 text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        <input
                            type="checkbox"
                            name="noIndex"
                            checked={Boolean(formData.noIndex)}
                            onChange={(event) => setFormData((current) => ({ ...current, noIndex: event.target.checked }))}
                            className="mt-1 h-4 w-4 accent-indigo-600"
                        />
                        <span>
                            <strong>Hide this page from search results</strong>
                            <span className={`mt-1 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Adds noindex, nofollow directives. Keep this off for published articles you want indexed.</span>
                        </span>
                    </label>

                    <div className={`rounded-lg border p-4 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <p className="truncate text-sm text-green-700">{window.location.origin}/blog/{slugPreview || 'your-post-slug'}</p>
                        <p className={`mt-1 truncate text-lg ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>{effectiveMetaTitle || 'Your meta title'}</p>
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{effectiveMetaDescription || 'Meta description search preview.'}</p>
                    </div>
                </div>
            </details>

            {error && (
                <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30 border border-red-700/50 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    ❌ {error}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (initial ? 'Updating...' : 'Adding...') : (initial ? 'Update Blog' : 'Add Blog')}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className={`flex-1 btn-secondary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export const TestimonialForm = ({ initial, onSubmit, onCancel }) => {
    const { isDark } = useContext(ThemeContext);
    const [formData, setFormData] = useState(
        initial || {
            name: '',
            company: '',
            review: '',
            image: null,
            imagePreview: null,
            rating: 5,
        }
    );

    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData({
                    ...formData,
                    image: file,
                    imagePreview: event.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        } else if (formData.name.length > 100) {
            errors.name = 'Name cannot exceed 100 characters';
        }

        if (!formData.review.trim()) {
            errors.review = 'Review is required';
        } else if (formData.review.trim().length < 10) {
            errors.review = 'Review must be at least 10 characters';
        } else if (formData.review.length > 1000) {
            errors.review = 'Review cannot exceed 1000 characters';
        }

        if (!formData.rating) {
            errors.rating = 'Rating is required';
        } else if (formData.rating < 1 || formData.rating > 5) {
            errors.rating = 'Rating must be between 1 and 5';
        }

        if (formData.company && formData.company.length > 100) {
            errors.company = 'Company cannot exceed 100 characters';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setValidationErrors({});

        // Client-side validation
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setLoading(false);
            return;
        }

        try {
            await onSubmit(formData);
        } catch (err) {
            // Handle backend validation errors
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                const backendErrors = {};
                err.response.data.errors.forEach(error => {
                    backendErrors[error.field] = error.message;
                });
                setValidationErrors(backendErrors);
                setError('Please correct the validation errors below');
            } else {
                setError(err.message || 'Failed to save testimonial. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 p-6 rounded-lg shadow transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {error && (
                <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30 border border-red-700/50 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    ❌ {error}
                </div>
            )}

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Name <span className="text-gray-500 text-sm font-normal">(2-100 characters)</span></label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${validationErrors.name
                        ? isDark ? 'bg-gray-700 border-red-500 text-white' : 'bg-white border-red-500 text-black'
                        : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        }`}
                    required
                />
                {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.name}</p>
                )}
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Company (Optional)</label>
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${validationErrors.company
                        ? isDark ? 'bg-gray-700 border-red-500 text-white' : 'bg-white border-red-500 text-black'
                        : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        }`}
                />
                {validationErrors.company && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.company}</p>
                )}
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Review <span className="text-gray-500 text-sm font-normal">(10-1000 characters)</span></label>
                <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none resize-none transition-colors ${validationErrors.review
                        ? isDark ? 'bg-gray-700 border-red-500 text-white' : 'bg-white border-red-500 text-black'
                        : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        }`}
                    required
                ></textarea>
                {validationErrors.review && (
                    <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.review}</p>
                )}
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formData.review.length}/1000 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Profile Image</label>
                    <div className="relative">
                        {formData.imagePreview && (
                            <div className="mb-3 relative">
                                <img src={formData.imagePreview} alt="Profile Preview" className="w-full h-24 object-cover rounded-lg" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <label className={`block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-indigo-600 transition ${isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <span className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{formData.image ? 'Change Image' : 'Upload Image'}</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Rating <span className="text-gray-500 text-sm font-normal">(1-5 stars)</span></label>
                    <select
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${validationErrors.rating
                            ? isDark ? 'bg-gray-700 border-red-500 text-white' : 'bg-white border-red-500 text-black'
                            : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                            }`}
                    >
                        {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                                {n} Star{n > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                    {validationErrors.rating && (
                        <p className="text-red-500 text-sm mt-1">⚠️ {validationErrors.rating}</p>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (initial ? 'Updating...' : 'Adding...') : (initial ? 'Update Testimonial' : 'Add Testimonial')}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className={`flex-1 btn-secondary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};
