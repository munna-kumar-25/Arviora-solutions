import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';
import { BlogForm } from '../components/Forms';

const CreateBlog = () => {
    const navigate = useNavigate();
    const { addBlog } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);

    const handleSubmit = async (formData) => {
        try {
            await addBlog(formData);
            navigate('/admin/blogs');
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} p-8`}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin/blogs')}
                        className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                    >
                        <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-900'} />
                    </button>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Create Blog Post
                    </h1>
                </div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <BlogForm
                        initial={null}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate('/admin/blogs')}
                    />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CreateBlog;
