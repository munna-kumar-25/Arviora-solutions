import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export const ServiceForm = ({ initial, onSubmit, onCancel }) => {
    const { isDark } = useContext(ThemeContext);
    const [formData, setFormData] = useState(
        initial || {
            title: '',
            description: '',
            price: '',
            category: '',
            features: '',
            benefits: '',
            image: null,
            imagePreview: null,
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
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Features (comma-separated)</label>
                <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleChange}
                    rows="2"
                    placeholder="e.g., Fast delivery, High quality, 24/7 support"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none resize-none transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                ></textarea>
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Benefits (comma-separated)</label>
                <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows="2"
                    placeholder="e.g., Increase revenue, Save time, Better customer experience"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none resize-none transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                ></textarea>
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Service Image</label>
                <div className="relative">
                    {formData.imagePreview && (
                        <div className="mb-3 relative">
                            <img src={formData.imagePreview} alt="Service" className="w-full h-24 object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, image: null, imagePreview: null })}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <label className={`block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-indigo-600 transition ${isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300'}`}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{formData.imagePreview ? 'Change Image' : 'Upload Image'}</span>
                    </label>
                </div>
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

export const BlogForm = ({ initial, onSubmit, onCancel }) => {
    const { isDark } = useContext(ThemeContext);
    const [formData, setFormData] = useState(
        initial || {
            title: '',
            content: '',
            image: null,
            imagePreview: null,
            category: 'web development',
            tags: '',
            author: 'Arviora Solutions',
            isPublished: true,
            date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
            description: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setValidationErrors({});

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
                setError(err.message || 'Failed to save blog. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 p-6 rounded-lg shadow transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                    required
                />
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Author</label>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                    placeholder="Author name"
                />
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Publish Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                    required
                />
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Tags (comma-separated)</label>
                <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                    placeholder="e.g., react, javascript, web development"
                />
            </div>

            <div>
                <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Content</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 resize-none transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                    required
                ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                    >
                        <option value="">-- Select Category --</option>
                        <option value="web development">Web Development</option>
                        <option value="mobile development">Mobile Development</option>
                        <option value="design">Design & UX</option>
                        <option value="cloud devops">Cloud & DevOps</option>
                        <option value="seo marketing">SEO & Marketing</option>
                        <option value="e-commerce">E-Commerce</option>
                        <option value="cybersecurity">Cybersecurity</option>
                        <option value="artificial intelligence">Artificial Intelligence</option>
                        <option value="business">Business & Startup</option>
                        <option value="technology trends">Technology Trends</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className={`block font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Status</label>
                    <select
                        name="isPublished"
                        value={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === 'true' })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-600 transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                    >
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                    </select>
                </div>
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
