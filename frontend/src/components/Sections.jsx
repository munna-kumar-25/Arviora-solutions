import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { ServiceCard, BlogCard } from './Cards';
import { getImageUrl } from '../services/api';

// Helper function to convert service title to URL slug
const toServiceSlug = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/\//g, '-')  // Convert slashes to dashes
        .replace(/&/g, 'and')  // Replace & with 'and'
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/[\s_-]+/g, '-')  // Replace spaces/underscores/multiple dashes with single dash
        .replace(/^-+|-+$/g, '');  // Remove leading/trailing dashes
};

export const AboutSection = () => {
    return (
        <section id="about" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <motion.img
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                        alt="About Us"
                        className="rounded-2xl shadow-2xl"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">About <span className="text-brand-primary">Arviora Solutions</span></h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                            We are a team of experienced developers, designers, and strategists dedicated to transforming businesses through innovative digital solutions. With over a decade of experience, we've helped hundreds of companies achieve their digital transformation goals.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-black dark:text-white mb-1">Our Mission</h3>
                                    <p className="text-gray-600 dark:text-gray-400">To empower businesses with cutting-edge technology and creative solutions.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">👁️</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-black dark:text-white mb-1">Our Vision</h3>
                                    <p className="text-gray-600 dark:text-gray-400">To be the most trusted digital partner for businesses worldwide.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">⭐</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-black dark:text-white mb-1">Our Values</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Innovation, integrity, and customer satisfaction drive everything we do.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/about">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="btn-primary"
                            >
                                Learn More
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export const ServicesSection = ({ services }) => {
    // Guard against undefined or empty services
    if (!services || services.length === 0) {
        return (
            <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="section-title">Our Services</h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Loading services...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">Our Services</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.slice(0, 3).map((service, index) => (
                        <motion.div
                            key={service._id || service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ServiceCard
                                service={service}
                                href={`/service/${toServiceSlug(service.title)}`}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* More Services Button */}
                {services.length > 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex justify-center mt-12"
                    >
                        <Link to="/services">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="btn-primary"
                            >
                                More Services
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export const BlogsSection = ({ blogs, limit = 3 }) => {
    // Guard against undefined or empty blogs
    if (!blogs || blogs.length === 0) {
        return (
            <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="section-title">Latest Articles</h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Loading articles...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h2 className="section-title">Latest Articles</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.slice(0, limit).map((blog, index) => (
                        <motion.div
                            key={blog._id || blog.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link to={`/blog/${blog.slug || blog._id}`} className="block h-full">
                                <BlogCard blog={blog} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* More Blogs Button */}
                {blogs.length > limit && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex justify-center mt-12"
                    >
                        <Link to="/blog">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="btn-primary"
                            >
                                More Blogs
                            </motion.button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export const TestimonialCarousel = ({ testimonials }) => {
    const [current, setCurrent] = useState(0);

    // Auto-slide every 5 seconds - MUST be before early return
    useEffect(() => {
        if (!testimonials || testimonials.length === 0) return;

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials]);

    // Guard against undefined or empty testimonials
    if (!testimonials || testimonials.length === 0) {
        return (
            <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
                    >
                        What Our Clients Say
                    </motion.h2>
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        Loading testimonials...
                    </div>
                </div>
            </section>
        );
    }

    const next = () => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
                >
                    What Our Clients Say
                </motion.h2>

                <div className="relative">
                    {/* Testimonial */}
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-600 transition-colors duration-300"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src={getImageUrl(testimonials[current].image)}
                                alt={testimonials[current].name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-bold text-black dark:text-white text-lg">{testimonials[current].name}</p>
                                <p className="text-gray-600 dark:text-gray-300">{testimonials[current].company || 'Partner'}</p>
                            </div>
                        </div>

                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < (testimonials[current].rating || 5) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
                                    ★
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 text-lg italic">"{testimonials[current].review || testimonials[current].comment || ''}"</p>
                    </motion.div>

                    {/* Controls */}
                    <div className="flex justify-between items-center mt-8">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={prev}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-full p-3 hover:shadow-lg transition"
                        >
                            <ChevronLeft size={24} className="text-white" />
                        </motion.button>

                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <motion.button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    animate={{ scale: current === i ? 1.2 : 1 }}
                                    className={`w-3 h-3 rounded-full transition ${current === i ? 'bg-indigo-600 dark:bg-pink-400' : 'bg-indigo-300 dark:bg-indigo-600'
                                        }`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            onClick={next}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-full p-3 hover:shadow-lg transition"
                        >
                            <ChevronRight size={24} className="text-white" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </section >
    );
};
