import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Share2, Copy } from 'react-feather';
import { ThemeContext } from '../context/ThemeContext';
import { AppContext } from '../context/AppContext';
import { getImageUrl } from '../services/api';

// Helper to convert title to slug
const toServiceSlug = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/\//g, '-')
        .replace(/&/g, 'and')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const parseFeatureCards = (features) => {
    const parseValue = (value, depth = 0) => {
        if (typeof value !== 'string' || depth > 2) return value;

        try {
            return parseValue(JSON.parse(value), depth + 1);
        } catch {
            return value;
        }
    };

    const parsedFeatures = parseValue(features);
    const items = Array.isArray(parsedFeatures) ? parsedFeatures : [parsedFeatures];

    return items
        .flatMap((item) => {
            const parsedItem = parseValue(item);
            return Array.isArray(parsedItem) ? parsedItem : [parsedItem];
        })
        .map((feature) => {
            if (typeof feature === 'string') {
                return { title: feature, description: '' };
            }
            if (!feature || typeof feature !== 'object') return null;
            return {
                title: typeof feature.title === 'string' ? feature.title : '',
                description: typeof feature.description === 'string' ? feature.description : '',
                image: typeof feature.image === 'string' ? feature.image : '',
            };
        })
        .filter((feature) => feature && feature.title.trim());
};

const ServiceDetail = () => {
    const { serviceName } = useParams();
    const { isDark } = useContext(ThemeContext);
    const { services, loading } = useContext(AppContext);
    const navigate = useNavigate();
    const [showShareMenu, setShowShareMenu] = React.useState(false);

    // Find service by matching slug with title
    let service = null;

    if (services && services.length > 0) {
        service = services.find(s => {
            if (!s.title) return false;
            return toServiceSlug(s.title) === serviceName;
        });
    }

    const featureCards = parseFeatureCards(service?.features);
    const topFeatureCards = parseFeatureCards(service?.topFeatures);

    // Show loading state
    if (loading || !services || services.length === 0) {
        return (
            <div className={`min-h-screen pt-20 flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading service...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className={`min-h-screen pt-20 flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>Service Not Found</h1>
                    <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>The service you're looking for doesn't exist.</p>
                    <Link to="/services" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                        Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`pt-24 pb-16 ${isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-white'}`}
            >
                <div className="max-w-5xl mx-auto px-4">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-2 mb-8 font-medium transition-colors ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
                    >
                        <ArrowLeft size={20} /> Back
                    </motion.button>

                    {/* Category Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            {service.category || 'Service'}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                    >
                        {service.title}
                    </motion.h1>

                </div>
            </motion.section>

            {/* Featured Image */}
            {service.image && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="max-w-6xl mx-auto px-4 pt-8 md:pt-12"
                >
                    <div className={`aspect-video rounded-2xl md:rounded-3xl overflow-hidden border shadow-xl ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                        <img
                            src={getImageUrl(service.image)}
                            alt={`${service.title} service`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </motion.section>
            )}

            {/* Content Section */}
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`max-w-5xl mx-auto px-4 py-12 md:py-16 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
                {/* Full Description */}
                {service.description && (
                    <div className="max-w-4xl mx-auto mb-12 md:mb-16">
                        <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>About This Service</h2>
                        <p className="leading-relaxed text-base md:text-lg whitespace-pre-wrap">{service.description}</p>
                    </div>
                )}

                {/* Features */}
                {featureCards.length > 0 && (
                    <div className="mb-12">
                        <div className="mb-6 text-center">
                            <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Key Features</h2>
                            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                A closer look at what this service includes.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {featureCards.map((feature, index) => {
                                return (
                                    <article
                                        key={`${feature.title}-${index}`}
                                        className={`overflow-hidden rounded-xl border shadow-sm transition-transform hover:-translate-y-1 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                                    >
                                        <div className={`border-b px-5 py-3 ${isDark ? 'border-indigo-400/20 bg-indigo-400/10' : 'border-indigo-100 bg-indigo-50/70'}`}>
                                            <h3 className={`font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-950'}`}>{feature.title}</h3>
                                        </div>
                                        <div className="flex min-h-24 items-start gap-3 px-5 py-4">
                                            <CheckCircle size={18} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {feature.description || feature.title}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Explore Your Top Features */}
                {topFeatureCards.length > 0 && (
                    <div className="mb-12">
                        <div className="mb-6 text-center">
                            <h2 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Explore Your Top Features
                            </h2>
                            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                See how these features support your business.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {topFeatureCards.map((feature, index) => {
                                return (
                                    <article
                                        key={`${feature.title}-${index}`}
                                        className={`overflow-hidden rounded-xl border shadow-sm transition-transform hover:-translate-y-1 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                                    >
                                        <div className={`flex h-40 items-center justify-center overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                            {feature.image ? (
                                                <img
                                                    src={getImageUrl(feature.image)}
                                                    alt={feature.title}
                                                    loading="lazy"
                                                    className="h-full w-full p-3 object-contain object-center"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100 text-sm text-indigo-700 dark:from-indigo-950 dark:to-violet-950 dark:text-indigo-200">
                                                    {feature.title}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`border-y px-5 py-3 ${isDark ? 'border-indigo-400/20 bg-indigo-400/10' : 'border-indigo-100 bg-indigo-50/70'}`}>
                                            <h3 className={`font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-950'}`}>{feature.title}</h3>
                                        </div>
                                        <p className={`min-h-20 px-5 py-4 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {feature.description || feature.title}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Share Section */}
                <div className={`border-t border-b py-8 my-12 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    {/* Share Header - Clickable */}
                    <motion.button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="w-full text-left mb-6 cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <motion.div
                                animate={{ scale: showShareMenu ? 1.2 : 1 }}
                                transition={{ duration: 0.3 }}
                                className={`transition ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
                            >
                                <Share2 size={24} />
                            </motion.div>
                            <div className="flex-1">
                                <p className={`font-semibold group-hover:text-indigo-600 transition ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Share this service
                                </p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Help others discover this service
                                </p>
                            </div>
                            <motion.span
                                animate={{ rotate: showShareMenu ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                                ▼
                            </motion.span>
                        </div>
                    </motion.button>

                    {/* Share Buttons */}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: showShareMenu ? 1 : 0,
                            height: showShareMenu ? 'auto' : 0,
                            pointerEvents: showShareMenu ? 'auto' : 'none'
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-wrap gap-3"
                    >
                        {/* Facebook */}
                        <motion.a
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 rounded-lg font-medium transition ${isDark ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            title="Share on Facebook"
                        >
                            f Facebook
                        </motion.a>

                        {/* Twitter */}
                        <motion.a
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(service.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 rounded-lg font-medium transition ${isDark ? 'bg-sky-900/40 text-sky-300 hover:bg-sky-900/60' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}
                            title="Share on Twitter"
                        >
                            𝕏 Twitter
                        </motion.a>

                        {/* LinkedIn */}
                        <motion.a
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 rounded-lg font-medium transition ${isDark ? 'bg-blue-800/40 text-blue-200 hover:bg-blue-800/60' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                            title="Share on LinkedIn"
                        >
                            in LinkedIn
                        </motion.a>

                        {/* WhatsApp */}
                        <motion.a
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(service.title + ' ' + window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 rounded-lg font-medium transition ${isDark ? 'bg-green-900/40 text-green-300 hover:bg-green-900/60' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                            title="Share on WhatsApp"
                        >
                            💬 WhatsApp
                        </motion.a>

                        {/* Copy Link */}
                        <motion.button
                            whileHover={{ scale: 1.05, translateY: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('✓ Link copied to clipboard!');
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${isDark ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            title="Copy link to clipboard"
                        >
                            <Copy size={18} /> Copy Link
                        </motion.button>
                    </motion.div>
                </div>
            </motion.article>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`mt-20 py-16 ${isDark ? 'bg-gray-800' : 'bg-indigo-50'}`}
            >
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Ready to Get Started?
                    </h3>
                    <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Let's discuss how this service can help your business.
                    </p>
                    <Link to="/contact" className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-lg transition-colors">
                        Get in Touch
                    </Link>
                </div>
            </motion.section>
        </div>
    );
};

export default ServiceDetail;
