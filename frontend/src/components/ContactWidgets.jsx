import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'react-feather';

const WHATSAPP_NUMBER = '7492902760';

const ContactWidgets = () => {
    // WhatsApp handler
    const handleWhatsApp = () => {
        const message = "Hi! I'm interested in learning more about Arviora Solutions' services.";
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Call handler
    const handleCall = () => {
        window.location.href = `tel:${WHATSAPP_NUMBER}`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 400, damping: 25 },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="fixed bottom-24 right-6 z-40 flex flex-col gap-4"
        >
            {/* WhatsApp Widget */}
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWhatsApp}
                className="group relative w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform"
                title="Chat on WhatsApp"
            >
                <MessageCircle size={24} className="text-white" />

                {/* Tooltip */}
                <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-3 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    WhatsApp
                </div>

                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
            </motion.button>

            {/* Call Widget */}
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.15, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCall}
                className="group relative w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform"
                title="Call Us"
            >
                <Phone size={24} className="text-white" />

                {/* Tooltip */}
                <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-3 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Call Us
                </div>

                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
            </motion.button>
        </motion.div>
    );
};

export default ContactWidgets;
