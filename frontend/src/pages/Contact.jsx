import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { ContactForm } from '../components/Forms';
import { AppContext } from '../context/AppContext';
import { Mail, Phone, MapPin, Clock } from 'react-feather';

const Contact = () => {
    const { addContactMessage } = useContext(AppContext);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (formData) => {
        addContactMessage(formData);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Get in touch with our team. We're here to help.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Get in Touch</h2>

                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="text-indigo-600 dark:text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email</h3>
                                <p className="text-gray-600 dark:text-gray-400">arviorasolution@gmail.com</p>
                                <p className="text-gray-600 dark:text-gray-400">arviorasolutions@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="text-indigo-600 dark:text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Phone</h3>
                                <p className="text-gray-600 dark:text-gray-400">+91-7492902760</p>
                                <p className="text-gray-600 dark:text-gray-400">+91-7492902760</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="text-indigo-600 dark:text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Address</h3>
                                <p className="text-gray-600 dark:text-gray-400">Adarsh Vihar Colony,</p>
                                <p className="text-gray-600 dark:text-gray-400">Bailey Road - Rukanpura, Patna 800014</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="text-indigo-600 dark:text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">Business Hours</h3>
                                <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p className="text-gray-600 dark:text-gray-400">Saturday: 10:00 AM - 4:00 PM</p>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="mt-8">
                            <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin size={48} className="text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600 dark:text-gray-400">Map will be integrated here</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-400 rounded-lg">
                                ✓ Your message has been sent successfully! We'll get back to you soon.
                            </div>
                        )}
                        <ContactForm onSubmit={handleSubmit} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
