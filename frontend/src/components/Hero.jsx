import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, Zap, ArrowRight, Target } from 'react-feather';

export const Hero = ({ title, subtitle, image, actions, scrollId, layout = 'premium' }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    // Animated background shapes
    const FloatingShape = ({ delay, size, position }) => (
        <motion.div
            animate={{
                y: [0, 30, 0],
                x: [0, 20, 0],
                rotate: [0, 180, 360],
            }}
            transition={{
                duration: 20 + delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={`absolute ${position} opacity-30 pointer-events-none`}
        >
            <div
                className={`${size} rounded-full bg-gradient-brand blur-3xl`}
            ></div>
        </motion.div>
    );

    // Premium Modern Layout
    if (layout === 'premium') {
        const socialProofItems = [
            {
                id: 'google',
                title: 'Google Maps',
                icon: MapPin,
                color: 'from-blue-600 to-cyan-500',
                description: 'Review us on Google',
                link: 'https://www.google.com/maps',
                stats: '4.9★',
            },
            {
                id: 'ambition',
                title: 'Ambition Box',
                icon: ArrowRight,
                color: 'from-purple-600 to-pink-500',
                description: 'Company Reviews',
                link: 'https://www.ambitionbox.com/',
                stats: '5.0★ (500+)',
            },
            {
                id: 'justdial',
                title: 'JustDial',
                icon: Zap,
                color: 'from-yellow-600 to-orange-500',
                description: 'Find us on JustDial',
                link: 'https://www.justdial.com',
                stats: '999',
            },
            {
                id: 'excellence',
                title: 'Excellence',
                icon: Target,
                color: 'from-indigo-600 to-violet-500',
                description: 'Our Commitment',
                link: '#about',
                stats: '100%',
            },
        ];

        return (
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-brand-dark py-20 transition-colors duration-300">
                {/* Animated Background Shapes */}
                <FloatingShape delay={0} size="w-96 h-96" position="top-10 -left-20" />
                <FloatingShape delay={2} size="w-72 h-72" position="bottom-20 -right-32" />
                <FloatingShape delay={4} size="w-64 h-64" position="top-1/2 right-1/4" />

                {/* Grid background pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-5">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(79,70,229,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(79,70,229,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-8"
                        >
                            {/* Main Title with gradient */}
                            <motion.h1
                                variants={itemVariants}
                                className="text-6xl md:text-7xl lg:text-7xl font-bold leading-tight"
                            >
                                <span className="gradient-text block mb-2">{title}</span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                variants={itemVariants}
                                className="text-xl text-black dark:text-brand-text-secondary leading-relaxed max-w-lg"
                            >
                                {subtitle}
                            </motion.p>

                            {/* Action Buttons */}
                            {actions && (
                                <motion.div
                                    variants={itemVariants}
                                    className="flex flex-col sm:flex-row gap-4 pt-4"
                                >
                                    {actions.map((action, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={action.onClick}
                                            className={`
                                                flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300
                                                ${action.primary
                                                    ? 'btn-primary group'
                                                    : 'btn-ghost'
                                                }
                                            `}
                                        >
                                            {action.label}
                                            {action.primary && (
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            )}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Right Social Proof Box */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, rotateY: -10 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="h-full"
                        >
                            {/* Main Container with glassmorphism */}
                            <div className="bg-gray-50 dark:bg-brand-surface border border-gray-200 dark:border-gray-700 rounded-2xl p-8 h-full flex flex-col backdrop-blur-md transition-colors duration-300">
                                {/* Header */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">
                                        <span className="gradient-text">Trusted Platforms</span>
                                    </h3>
                                    <p className="text-gray-600 dark:text-brand-text-secondary">Connect with us everywhere</p>
                                </div>

                                {/* Social Proof Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
                                    {socialProofItems.map((item, index) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <motion.a
                                                key={item.id}
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + index * 0.1 }}
                                                whileHover={{ y: -10, scale: 1.05 }}
                                                className={`
                                                    group relative bg-gradient-to-br ${item.color} p-6 rounded-xl
                                                    overflow-hidden cursor-pointer transition-all duration-300
                                                    hover:shadow-glow-brand before:absolute before:inset-0 
                                                    before:opacity-0 before:hover:opacity-30 before:bg-white/10
                                                    before:transition-opacity
                                                `}
                                            >
                                                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2 text-center">
                                                    <IconComponent size={28} className="text-white group-hover:scale-110 transition-transform" />
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{item.title}</p>
                                                        <p className="text-white/70 text-xs">{item.stats}</p>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        );
                                    })}
                                </div>

                                {/* Trust badge with glassmorphism */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                    <p className="text-sm font-medium">
                                        <span className="text-brand-secondary">★★★★★</span>
                                        <span className="text-gray-600 dark:text-brand-text-secondary ml-2">Trusted by 500+ businesses</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    {scrollId && (
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                        >
                            <a
                                href={`#${scrollId}`}
                                className="flex flex-col items-center text-brand-secondary hover:text-brand-primary transition-colors"
                            >
                                <span className="text-sm font-medium mb-2">Scroll</span>
                                <ChevronDown size={24} />
                            </a>
                        </motion.div>
                    )}
                </div>
            </section>
        );
    }

    // Center layout (for other pages)
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-brand-dark transition-colors duration-300">
            {/* Background shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <FloatingShape delay={0} size="w-96 h-96" position="top-10 -left-20" />
                <FloatingShape delay={2} size="w-72 h-72" position="bottom-20 -right-32" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-6xl mx-auto px-4 text-center"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-6xl md:text-7xl font-bold mb-6 gradient-text"
                >
                    {title}
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-xl text-black dark:text-brand-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
                >
                    {subtitle}
                </motion.p>

                {actions && (
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    >
                        {actions.map((action, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={action.onClick}
                                className={`
                                    px-8 py-4 rounded-lg font-semibold text-lg transition-all
                                    ${action.primary ? 'btn-primary' : 'btn-ghost'}
                                `}
                            >
                                {action.label}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {image && (
                    <motion.div
                        variants={itemVariants}
                        className="mt-12"
                    >
                        <img src={image} alt="Hero" className="w-full max-w-2xl mx-auto rounded-2xl shadow-glow-brand" />
                    </motion.div>
                )}

                {scrollId && (
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    >
                        <a
                            href={`#${scrollId}`}
                            className="flex flex-col items-center text-brand-secondary hover:text-brand-primary transition-colors"
                        >
                            <span className="text-sm font-medium mb-2">Scroll</span>
                            <ChevronDown size={24} />
                        </a>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
};

export default Hero;
