import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Moon, Sun } from 'react-feather';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login, loading, error, setError } = useContext(AuthContext);
    const { isDark, toggleTheme } = useContext(ThemeContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            // Call login and wait for result
            const result = await login(email, password);

            if (result) {
                // Navigate to admin dashboard after successful login
                navigate('/admin');
            } else {
                // Error was already set in localStorage by AuthContext
                // Just wait for the error to be display
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className={`min-h-screen overflow-hidden relative ${isDark ? 'bg-gray-950' : 'bg-white'} flex items-center justify-center p-4 transition-colors duration-300`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Background Gradient Base */}
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-black' : 'bg-gradient-to-br from-indigo-50 via-cyan-50 to-blue-50'}`}></div>

                {/* Animated Circles */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute top-20 left-10 w-72 h-72 ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/20'} rounded-full blur-3xl`}
                ></motion.div>

                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className={`absolute bottom-20 right-10 w-80 h-80 ${isDark ? 'bg-cyan-600/10' : 'bg-cyan-400/20'} rounded-full blur-3xl`}
                ></motion.div>

                <motion.div
                    animate={{
                        x: [0, 50, -50, 0],
                        y: [0, -80, 50, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-1/2 left-1/3 w-60 h-60 ${isDark ? 'bg-pink-600/5' : 'bg-pink-300/15'} rounded-full blur-3xl`}
                ></motion.div>

                {/* Floating Dots */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={`absolute top-40 right-1/4 w-2 h-2 ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'} rounded-full`}
                ></motion.div>

                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className={`absolute bottom-40 left-1/4 w-3 h-3 ${isDark ? 'bg-cyan-400' : 'bg-cyan-500'} rounded-full`}
                ></motion.div>

                <motion.div
                    animate={{ y: [0, -25, 0], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                    className={`absolute top-2/3 right-1/3 w-2 h-2 ${isDark ? 'bg-pink-400' : 'bg-pink-500'} rounded-full`}
                ></motion.div>

                {/* Grid Background Lines */}
                <div className={`absolute inset-0 opacity-5 ${isDark ? 'bg-white' : 'bg-gray-900'}`} style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px'
                }}></div>
            </div >

            {/* Content - Positioned Above Background */}
            < div className="relative z-10" >

                {/* Theme Toggle Button */}
                < motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className={`fixed top-4 right-4 p-2 rounded-lg transition z-50 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white/80 hover:bg-white shadow-lg'}`}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {
                        isDark ? (
                            <Sun size={20} className="text-yellow-400" />
                        ) : (
                            <Moon size={20} className="text-indigo-600" />
                        )}
                </motion.button >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white'} rounded-2xl shadow-2xl p-8 transition-colors duration-300`}>
                        {/* Logo */}
                        <div className="flex items-center justify-center mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="mr-3"
                            >
                                <img
                                    src="/favicon.jpeg"
                                    alt="Arviora Solutions"
                                    className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain p-0.5 shadow-md"
                                />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-brand-primary">
                                Arviora Solutions
                            </h1>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
                        <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Access your admin dashboard</p>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}


                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-500' : 'border-gray-200 bg-white text-gray-900 focus:border-indigo-600'}`}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className={`block font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-indigo-500' : 'border-gray-200 bg-white text-gray-900 focus:border-indigo-600'}`}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-4 top-4 transition ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                                    }`}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </motion.button>
                        </form>

                        {/* Footer */}
                        <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Contact support for access issues
                        </p>
                    </div>
                </motion.div>
            </div >
        </div >
    );
};

export default AdminLogin;
