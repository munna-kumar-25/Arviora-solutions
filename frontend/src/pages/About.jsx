import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Award, Globe, Zap, Target } from 'react-feather';
import { ThemeContext } from '../context/ThemeContext';

const About = () => {
    const { isDark } = useContext(ThemeContext);

    const stats = [
        { icon: Users, label: 'Team Members', value: '200+' },
        { icon: Target, label: 'Projects Completed', value: '500+' },
        { icon: Globe, label: 'Countries Served', value: '20+' },
        { icon: Award, label: 'Awards Won', value: '50+' },
    ];

    const values = [
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We stay ahead of the curve with cutting-edge technology and creative solutions.',
        },
        {
            icon: Target,
            title: 'Excellence',
            description: 'We deliver exceptional quality in everything we do, exceeding client expectations.',
        },
        {
            icon: Users,
            title: 'Collaboration',
            description: 'We believe in teamwork and transparent communication with our clients.',
        },
        {
            icon: Globe,
            title: 'Integrity',
            description: 'We operate with honesty, transparency, and ethical practices.',
        },
    ];

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
                            About <span className="text-brand-primary">Arviora Solutions</span>
                        </h1>
                        <p className={`text-xl md:text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
                            We are a team of dedicated professionals committed to transforming businesses through innovative digital solutions.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Company Overview */}
            <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.img
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                            alt="Our Team"
                            className="rounded-2xl shadow-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Our Story
                            </h2>
                            <p className={`text-lg mb-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Founded in 2014, Arviora Solutions started as a small team of passionate developers with a big vision. Over the past decade, we've grown into a full-service digital agency, serving clients across multiple industries and continents.
                            </p>
                            <p className={`text-lg mb-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Our success is built on three pillars: talented people, innovative thinking, and unwavering commitment to our clients. We don't just build solutions; we partner with our clients to achieve their business goals.
                            </p>
                            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Today, with over 200 team members and 500+ successful projects, we continue to push the boundaries of what's possible in digital transformation.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Our Impact by Numbers
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`p-8 rounded-xl text-center ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}
                                >
                                    <Icon className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                                    <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {stat.value}
                                    </div>
                                    <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                        {stat.label}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`p-8 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                        >
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                                <Target size={24} className="text-brand-primary" />
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Our Mission
                            </h3>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                To empower businesses of all sizes with cutting-edge technology and creative digital solutions that drive growth and success.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className={`p-8 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                        >
                            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                                <Globe size={24} className="text-pink-600 dark:text-pink-400" />
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Our Vision
                            </h3>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                To be the most trusted and innovative digital transformation partner, recognized globally for our excellence and impact.
                            </p>
                        </motion.div>

                        {/* Values */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`p-8 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                        >
                            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                                <Award size={24} className="text-brand-secondary" />
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Our Values
                            </h3>
                            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                Innovation, integrity, excellence, and collaboration drive everything we do. We're committed to delivering exceptional value.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values Grid */}
            <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Our Core Values
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className={`p-8 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg flex gap-4`}
                                >
                                    <div>
                                        <Icon className="w-8 h-8 text-brand-primary flex-shrink-0" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {value.title}
                                        </h3>
                                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                            {value.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Highlights */}
            <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Why Choose Us?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className={`p-8 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}
                            >
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Proven Track Record
                                </h3>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    500+ successful projects with 98% client satisfaction rate
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className={`p-8 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}
                            >
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Expert Team
                                </h3>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    200+ talented professionals with diverse expertise and industry knowledge
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`p-8 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg`}
                            >
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Global Presence
                                </h3>
                                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    Serving clients across 20+ countries with 24/7 support
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
