import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogCard } from '../components/Cards';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';
import { Search } from 'react-feather';

const Blog = () => {
    const { blogs } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories from blogs
    const uniqueCategories = ['All', ...new Set(blogs.map(blog => blog.category))];
    const categories = uniqueCategories.length > 1 ? uniqueCategories : ['All'];

    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={`min-h-screen pt-20 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h1 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-dark'}`}>Our Blog</h1>
                    <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Stay updated with the latest trends and insights</p>
                </motion.div>

                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Search */}
                        <div className="relative">
                            <Search className={`absolute left-4 top-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-600 transition ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                            />
                        </div>

                        {/* Category */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={`px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-indigo-600 transition ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Tags */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full font-medium transition ${selectedCategory === cat
                                    ? 'bg-indigo-600 text-white'
                                    : isDark ? 'bg-gray-800 border-2 border-gray-700 text-gray-300 hover:border-indigo-600' : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-600'
                                    }`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Blog Grid */}
                {filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link to={`/blog/${blog.slug || blog._id}`} className="block h-full">
                                    <BlogCard blog={blog} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No articles found. Try adjusting your search criteria.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Blog;
