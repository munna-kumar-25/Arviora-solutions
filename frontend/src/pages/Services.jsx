import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ServiceCard } from '../components/Cards';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';

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

const Services = () => {
    const { services } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
            {/* Hero Section */}
            <section className={`pt-32 pb-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Our <span className="text-brand-primary">Services</span>
                        </h1>
                        <p className={`text-xl md:text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
                            Comprehensive digital solutions tailored to meet your business needs. From development to strategy, we deliver excellence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4">
                    {services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service, index) => (
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
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                No services available at the moment. Please check back soon!
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Why Choose Our Services */}
            <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Why Choose Our Services?
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Expert Team', description: 'Highly skilled professionals with years of experience' },
                            { title: 'Custom Solutions', description: 'Tailored approach for your unique business needs' },
                            { title: '24/7 Support', description: 'Round-the-clock assistance and maintenance' },
                            { title: 'Quality Assured', description: 'Rigorous testing and quality control process' },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`p-8 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                            >
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {item.title}
                                </h3>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to Get Started?</h2>
                        <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Let's discuss which service is the best fit for your business goals.
                        </p>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            href="/contact"
                            className={`inline-block px-8 py-4 font-bold rounded-lg hover:shadow-lg transition-all ${isDark ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                            Schedule Consultation
                        </motion.a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Services;
