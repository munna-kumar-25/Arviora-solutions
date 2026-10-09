import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ExternalLink, MessageSquare, Send as SendIcon } from 'react-feather';
import { ChatbotContext } from '../context/ChatbotContext';
import { ThemeContext } from '../context/ThemeContext';
import { CONTACT_CONFIG } from '../config/contactConfig';

export const ChatbotWidget = () => {
    const { isOpen, toggleChatbot, messages, addMessage } = useContext(ChatbotContext);
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addMessage(inputValue, 'user');
            setInputValue('');
        }
    };

    const quickReplies = [
        'Services',
        'Pricing',
        'Contact',
        'Blogs'
    ];

    return (
        <>
            {/* Floating Chatbot Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleChatbot}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-40 transition-all ${isDark
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:shadow-xl'
                    : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-xl'
                    }`}
                title="Open Chatbot"
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <MessageCircle size={24} className="text-white" />
                )}
            </motion.button>

            {/* Chatbot Window - Responsive */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed bottom-6 right-6 md:bottom-24 md:right-6 w-full md:w-96 mx-4 md:mx-0 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'
                            }`}
                        style={{
                            maxHeight: 'calc(100vh - 120px)',
                            maxWidth: 'calc(100vw - 32px)'
                        }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-3 md:p-4 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-base md:text-lg">Arviora Assistant</h3>
                                    <p className="text-xs md:text-sm text-indigo-100">Online - Here to help! 👋</p>
                                </div>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    onClick={toggleChatbot}
                                    className="p-1 hover:bg-white/20 rounded-lg transition"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className={`flex-1 overflow-y-auto p-3 md:p-4 space-y-4 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className="flex flex-col gap-2">
                                        <div
                                            className={`px-4 py-2 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${message.sender === 'bot'
                                                ? isDark
                                                    ? 'bg-gray-800 text-gray-100 border border-indigo-600/30'
                                                    : 'bg-gray-200 text-gray-900'
                                                : 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
                                                }`}
                                        >
                                            {message.text}
                                        </div>
                                        {message.action === 'navigate' && message.link && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    navigate(message.link);
                                                    toggleChatbot();
                                                }}
                                                className="flex items-center justify-center gap-1 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:shadow-lg transition w-full"
                                            >
                                                <ExternalLink size={14} />
                                                View Blogs
                                            </motion.button>
                                        )}
                                        {message.action === 'contact' && message.contactMethods && (
                                            <div className="flex flex-col gap-2 w-full">
                                                {message.contactMethods.includes('whatsapp') && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={CONTACT_CONFIG.whatsapp.getUrl()}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-500 hover:bg-green-600 text-white hover:shadow-lg transition w-full"
                                                        title={`Chat with us on ${CONTACT_CONFIG.whatsapp.displayNumber}`}
                                                    >
                                                        <MessageSquare size={16} />
                                                        <span className="hidden sm:inline">WhatsApp</span>
                                                        <span className="sm:hidden">Chat</span>
                                                    </motion.a>
                                                )}
                                                {message.contactMethods.includes('telegram') && (
                                                    <motion.a
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        href={CONTACT_CONFIG.telegram.getUrl()}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transition w-full"
                                                        title={`Chat with us on Telegram: @${CONTACT_CONFIG.telegram.handle}`}
                                                    >
                                                        <SendIcon size={16} />
                                                        <span className="hidden sm:inline">Telegram</span>
                                                        <span className="sm:hidden">Telegram</span>
                                                    </motion.a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        {messages.length <= 1 && (
                            <div className={`px-3 md:px-4 py-3 border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                                <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Quick replies:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {quickReplies.map((reply) => (
                                        <motion.button
                                            key={reply}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                addMessage(reply, 'user');
                                            }}
                                            className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium transition ${isDark
                                                ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40'
                                                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                                }`}
                                        >
                                            {reply}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className={`border-t p-3 md:p-4 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type message..."
                                    className={`flex-1 px-3 md:px-4 py-2 rounded-full text-sm focus:outline-none transition ${isDark
                                        ? 'bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-600'
                                        : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-600'
                                        }`}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-2 rounded-full hover:shadow-lg transition"
                                    title="Send message"
                                >
                                    <SendIcon size={18} />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatbotWidget;
