import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, ChevronDown } from 'react-feather';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // Function to convert service title to URL slug
    const toSlug = (str) => {
        return str
            .toLowerCase()
            .trim()
            .replace(/\//g, '-')  // Convert slashes to dashes first
            .replace(/&/g, 'and')  // Replace & with 'and'
            .replace(/[^\w\s-]/g, '')  // Remove other special characters
            .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores/multiple dashes with single dash
            .replace(/^-+|-+$/g, '');  // Remove leading/trailing dashes
    };

    // Handle service click
    const handleServiceClick = (serviceName) => {
        navigate(`/service/${toSlug(serviceName)}`);
        setIsServicesOpen(false);
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
    ];

    const appServices = [
        'Android & iOS App Development',
        'Cross-platform Apps',
        'Enterprise Applications',
        'App UI/UX Design'
    ];

    const webServices = [
        'Custom Website Development',
        'UI/UX Design',
        'E-commerce Development',
        'CMS-Based Websites',
        'Web Application Development'
    ];

    const digitalMarketingServices = [
        'Search Engine Optimization (SEO)',
        'Pay-Per-Click (PPC) & Paid Ads (Google & Meta Ads)',
        'Social Media Marketing (SMM & SMO)',
        'Content Marketing',
        'Email Marketing',
        'Conversion Rate Optimization (CRO)',
        'Online Reputation Management (ORM)',
        'Local SEO'
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-2 sm:px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <img
                            src="/favicon.jpeg"
                            alt="Arviora Solutions Logo"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-md"
                        />
                        <span className="hidden sm:block text-lg sm:text-2xl font-bold text-brand-primary whitespace-nowrap">
                            Arviora Solutions
                        </span>
                        <span className="sm:hidden text-sm font-bold text-brand-primary whitespace-nowrap">
                            Arviora
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex space-x-2 lg:space-x-8">
                        {navLinks.map((link) => (
                            <motion.div key={link.name} whileHover={{ scale: 1.05 }}>
                                <Link
                                    to={link.href}
                                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-sm lg:text-base"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}

                        {/* Services Dropdown */}
                        <div className="relative group">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setIsServicesOpen(!isServicesOpen)}
                                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-sm lg:text-base"
                            >
                                <span>Services</span>
                                <motion.div
                                    animate={{ rotate: isServicesOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown size={16} className="lg:w-5 lg:h-5" />
                                </motion.div>
                            </motion.button>

                            {/* Dropdown Menu */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{
                                    opacity: isServicesOpen ? 1 : 0,
                                    y: isServicesOpen ? 0 : -10,
                                    pointerEvents: isServicesOpen ? 'auto' : 'none'
                                }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 mt-2 w-72 lg:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-y-auto max-h-96 z-50 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="px-4 py-4 space-y-4">
                                    {/* Mobile App Development Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                            Mobile App Development
                                        </h3>
                                        <ul className="space-y-2">
                                            {appServices.map((service, index) => (
                                                <li key={index}>
                                                    <button
                                                        onClick={() => handleServiceClick(service)}
                                                        className="w-full text-left flex items-start space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-1"
                                                    >
                                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                                        <span>{service}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Web Development Solutions Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                            Web Development Solutions
                                        </h3>
                                        <ul className="space-y-2">
                                            {webServices.map((service, index) => (
                                                <li key={index}>
                                                    <button
                                                        onClick={() => handleServiceClick(service)}
                                                        className="w-full text-left flex items-start space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-1"
                                                    >
                                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                                        <span>{service}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Digital Marketing Solutions Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                                            Digital Marketing Solutions
                                        </h3>
                                        <ul className="space-y-2">
                                            {digitalMarketingServices.map((service, index) => (
                                                <li key={index}>
                                                    <button
                                                        onClick={() => handleServiceClick(service)}
                                                        className="w-full text-left flex items-start space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-1"
                                                    >
                                                        <span className="text-indigo-600 dark:text-indigo-400 mt-1">•</span>
                                                        <span>{service}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Contact Link */}
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                to="/contact"
                                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-sm lg:text-base"
                            >
                                Contact
                            </Link>
                        </motion.div>
                    </div>

                    {/* Demo Booking, Theme Toggle & Mobile Menu Button */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link
                            to="/book-demo"
                            className="hidden rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 sm:inline-flex lg:px-4"
                        >
                            Book Demo
                        </Link>

                        {/* Theme Toggle Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? (
                                <Sun size={18} className="sm:w-5 sm:h-5 text-yellow-400" />
                            ) : (
                                <Moon size={18} className="sm:w-5 sm:h-5 text-indigo-600" />
                            )}
                        </motion.button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="sm:hidden p-2 dark:text-gray-300 flex-shrink-0"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2 px-2 transition-colors"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Services Dropdown */}
                        <div className="px-3 py-2">
                            <button
                                onClick={() => setIsServicesOpen(!isServicesOpen)}
                                className="flex items-center space-x-2 w-full text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 px-0 py-2"
                            >
                                <span>Services</span>
                                <motion.div
                                    animate={{ rotate: isServicesOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown size={16} className="sm:w-5 sm:h-5" />
                                </motion.div>
                            </button>

                            {/* Mobile Services Submenu */}
                            {isServicesOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2 space-x-2"
                                >
                                    {/* Mobile App Development */}
                                    <div className="pl-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2 px-2">
                                            Mobile App Development
                                        </h4>
                                        <div className="space-y-1">
                                            {appServices.map((service, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleServiceClick(service)}
                                                    className="w-full text-left flex items-start space-x-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                                                    <span>{service}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Web Development Solutions */}
                                    <div className="pl-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2 px-2">
                                            Web Development Solutions
                                        </h4>
                                        <div className="space-y-1">
                                            {webServices.map((service, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleServiceClick(service)}
                                                    className="w-full text-left flex items-start space-x-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                                                    <span>{service}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Digital Marketing Solutions */}
                                    <div className="pl-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2 px-2">
                                            Digital Marketing Solutions
                                        </h4>
                                        <div className="space-y-1">
                                            {digitalMarketingServices.map((service, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleServiceClick(service)}
                                                    className="w-full text-left flex items-start space-x-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0">•</span>
                                                    <span>{service}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <Link
                            to="/contact"
                            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact
                        </Link>

                        <Link
                            to="/book-demo"
                            className="mx-3 mt-2 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                            onClick={() => setIsOpen(false)}
                        >
                            Book Demo
                        </Link>

                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
