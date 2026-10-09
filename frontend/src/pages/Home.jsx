import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import { AboutSection, ServicesSection, BlogsSection, TestimonialCarousel } from '../components/Sections';
import { AppContext } from '../context/AppContext';

const Home = () => {
    const { services, blogs, testimonials } = useContext(AppContext);

    const heroActions = [
        {
            label: 'Get Started',
            primary: true,
            onClick: () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }),
        },
        {
            label: 'Learn More',
            primary: false,
            onClick: () => document.getElementById('about').scrollIntoView({ behavior: 'smooth' }),
        },
    ];

    return (
        <div>
            <Hero
                layout="premium"
                title="Transform Your Business Digitally"
                subtitle="We provide innovative solutions to help your business thrive in the digital age. From web development to enterprise solutions, we've got you covered."
                scrollId="about"
                actions={heroActions}
            />

            <AboutSection />

            <ServicesSection services={services} />

            <BlogsSection blogs={blogs} limit={3} />

            <TestimonialCarousel testimonials={testimonials} />

            {/* Contact Preview Section */}
            <section id="contact" className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ready to Start Your Project?</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Let's work together to bring your vision to life. Contact us today for a free consultation.
                        </p>
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                            >
                                Get in Touch
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
