import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'react-feather';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subscribing, setSubscribing] = useState(false);
    const [subscribeError, setSubscribeError] = useState('');

    const handleNewsletterSubscribe = async (e) => {
        e.preventDefault();
        setSubscribing(true);
        setSubscribeError('');

        // Validate email
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setSubscribeError('Please enter a valid email address');
            setSubscribing(false);
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL || (
                process.env.NODE_ENV === 'production'
                    ? 'https://arviora-solutions-2.onrender.com/api'
                    : 'http://localhost:5000/api'
            );
            const response = await fetch(`${apiUrl}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to subscribe');
            }

            // Show success message
            setEmail('');
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 3000);
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            setSubscribeError(error.message || 'Failed to subscribe to newsletter');
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <footer className="bg-white dark:bg-brand-dark text-black dark:text-white py-12 md:py-20 transition-colors duration-300 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12 mb-12 md:mb-16">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                            <img src="/favicon.jpeg" alt="Arviora Solutions" className="w-10 h-10 rounded-lg shadow-md flex-shrink-0" />
                            <span className="text-xl sm:text-2xl font-bold text-brand-primary">Arviora Solutions</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                            Your trusted digital transformation partner. Empowering businesses with cutting-edge technology solutions.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-2 sm:gap-4">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                                <motion.a
                                    key={index}
                                    href="#"
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gradient-brand hover:text-white flex items-center justify-center transition-all duration-300"
                                >
                                    <Icon size={16} className="sm:w-5 sm:h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-sm md:text-base lg:text-lg mb-3 md:mb-4 lg:mb-6 text-black dark:text-white">Navigation</h4>
                        <ul className="space-y-2 md:space-y-3">
                            <li>
                                <Link to="/" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <a href="#about" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200 cursor-pointer">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200 cursor-pointer">
                                    Services
                                </a>
                            </li>
                            <li>
                                <Link to="/contact" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-sm md:text-base lg:text-lg mb-3 md:mb-4 lg:mb-6 text-black dark:text-white">Services</h4>
                        <ul className="space-y-2 md:space-y-3">
                            <li>
                                <a href="#services" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200 cursor-pointer">
                                    Web Development
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200 cursor-pointer">
                                    Mobile Apps
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200 cursor-pointer">
                                    UI/UX Design
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200 cursor-pointer">
                                    Cloud Solutions
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h4 className="font-bold text-sm md:text-base lg:text-lg mb-3 md:mb-4 lg:mb-6 text-black dark:text-white">Get in Touch</h4>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <Mail size={18} className="sm:w-5 sm:h-5 text-brand-primary mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">Email</p>
                                    <a href="mailto:arviorasolutions@gmail.com" className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200 break-all">
                                        arviorasolutions@gmail.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                                <Phone size={18} className="sm:w-5 sm:h-5 text-brand-secondary mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">Phone</p>
                                    <a href="tel:+917492902760" className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200">
                                        +91-7492902760
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3">
                                <MapPin size={18} className="sm:w-5 sm:h-5 text-brand-primary mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide">Location</p>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">Adarsh Vihar Colony, Bailey Road, Patna</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 text-black dark:text-white">Newsletter</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">Subscribe to get updates on our latest services.</p>

                        {subscribed && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium text-center"
                            >
                                ✓ Subscribed successfully! Check your email.
                            </motion.div>
                        )}

                        {subscribeError && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg text-sm font-medium text-center"
                            >
                                ❌ {subscribeError}
                            </motion.div>
                        )}

                        <form onSubmit={handleNewsletterSubscribe} className="flex flex-col gap-2 sm:gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={subscribing}
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors duration-200 disabled:opacity-50"
                                required
                            />
                            <motion.button
                                type="submit"
                                disabled={subscribing}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full btn-primary text-sm sm:text-base font-medium px-3 sm:px-4 py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {subscribing ? 'Subscribing...' : 'Subscribe'}
                            </motion.button>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-6 md:mb-8"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center md:text-left">
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                        © {currentYear} <span className="font-bold text-brand-primary">Arviora Solutions</span>. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <Link to="/privacy" className="hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200">
                            Privacy Policy
                        </Link>

                        <Link to="/terms" className="hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200">
                            Terms of Service
                        </Link>
                        <Link to="/cookies" className="hover:text-brand-primary dark:hover:text-brand-secondary font-medium transition-colors duration-200">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export const SkeletonLoader = ({ count = 3, variant = 'card' }) => {
    const skeletons = Array(count).fill(0);

    if (variant === 'card') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletons.map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="bg-gray-200 rounded-2xl h-64"
                    />
                ))}
            </div>
        );
    }

    if (variant === 'blog') {
        return (
            <div className="space-y-6">
                {skeletons.map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <div className="flex gap-6">
                            <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="flex-1">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {skeletons.map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-12 bg-gray-200 rounded"
                />
            ))}
        </div>
    );
};

export const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center py-12">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full"
            />
        </div>
    );
};

export const ErrorMessage = ({ message, onDismiss }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-red-800">Error</h3>
                    <p className="text-red-700 text-sm mt-1">{message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-red-600 hover:text-red-800 font-bold"
                    >
                        ✕
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export const SuccessMessage = ({ message, onDismiss }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-green-800">Success</h3>
                    <p className="text-green-700 text-sm mt-1">{message}</p>
                </div>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="text-green-600 hover:text-green-800 font-bold"
                    >
                        ✕
                    </button>
                )}
            </div>
        </motion.div>
    );
};
