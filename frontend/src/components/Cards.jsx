import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Edit2, Layers, Monitor, Smartphone, TrendingUp, Trash2 } from 'react-feather';
import { getImageUrl } from '../services/api';

export const ServiceCard = ({ service, onEdit, onDelete, href }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const description = service.description || '';

    useEffect(() => {
        setImageFailed(false);
    }, [service.image]);

    const category = (service.category || '').toLowerCase();
    const CategoryIcon = category.includes('mobile')
        ? Smartphone
        : category.includes('web')
            ? Monitor
            : category.includes('market')
                ? TrendingUp
                : category.includes('software') || category.includes('development')
                    ? Code
                    : Layers;
    const fallbackGradient = category.includes('mobile')
        ? 'from-violet-500 via-indigo-500 to-blue-600'
        : category.includes('web')
            ? 'from-cyan-500 via-blue-500 to-indigo-600'
            : category.includes('market')
                ? 'from-amber-400 via-orange-500 to-rose-600'
                : 'from-indigo-500 via-violet-500 to-fuchsia-600';

    return (
        <motion.div
            whileHover={{ y: -6 }}
            className="group relative h-full min-h-[23rem] sm:min-h-[24rem] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/50 overflow-hidden transition-all duration-300 flex flex-col"
        >
            <div className="relative isolate h-44 shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-900 sm:h-48">
                {service.image && !imageFailed ? (
                    <img
                        src={getImageUrl(service.image)}
                        alt={service.title}
                        onError={() => setImageFailed(true)}
                        loading="lazy"
                        className="absolute inset-0 block h-full w-full object-contain object-center"
                    />
                ) : (
                    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-br ${fallbackGradient}`}>
                        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border border-white/20" />
                        <div className="absolute -right-2 -top-8 h-40 w-40 rounded-full border border-white/20" />
                        <div className="absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/30 bg-white/15 text-white shadow-xl shadow-indigo-950/20 backdrop-blur-md transition-transform duration-500 group-hover:scale-105">
                                <CategoryIcon size={42} strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-8 h-3 w-3 rounded-full bg-white/70 shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                    </div>
                )}
                {href && (
                    <Link
                        to={href}
                        aria-label={`Explore ${service.title}`}
                        className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-indigo-600"
                    />
                )}
                <span className="pointer-events-none absolute left-4 top-4 z-20 max-w-[calc(100%-2rem)] truncate rounded-full bg-white/95 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-indigo-200">
                    {service.category || 'Our Service'}
                </span>
            </div>

            <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 min-h-[3rem] line-clamp-2">
                    {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-line line-clamp-3">
                    {description}
                </p>

                {href && (
                    <Link
                        to={href}
                        className="inline-flex items-center gap-2 mt-auto pt-5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                        Explore service <ArrowRight size={16} />
                    </Link>
                )}

                {(onEdit || onDelete) && (
                    <div className="flex gap-3 mt-auto">
                        {onEdit && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => onEdit(service)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
                            >
                                <Edit2 size={18} /> Edit
                            </motion.button>
                        )}
                        {onDelete && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => onDelete(service._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                            >
                                <Trash2 size={18} /> Delete
                            </motion.button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const BlogCard = ({ blog, onEdit, onDelete, showActions = false }) => {
    const description = blog.description || blog.content || '';

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all h-full flex flex-col"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                <img
                    src={getImageUrl(blog.image)}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-6 relative z-10 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-black dark:text-white mb-3 line-clamp-2">{blog.title}</h3>
                <div
                    className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 prose prose-sm dark:prose-invert max-w-none flex-1"
                    dangerouslySetInnerHTML={{ __html: description }}
                />

                {/* Actions */}
                {showActions && (onEdit || onDelete) && (
                    <div className="flex gap-3 mt-auto">
                        {onEdit && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => onEdit(blog)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
                            >
                                <Edit2 size={18} /> Edit
                            </motion.button>
                        )}
                        {onDelete && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => onDelete(blog._id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                            >
                                <Trash2 size={18} /> Delete
                            </motion.button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const TestimonialCard = ({ testimonial, onEdit, onDelete, showActions = false }) => {
    const renderStars = (rating) => {
        return (
            <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all"
        >
            {renderStars(testimonial.rating)}

            <p className="text-gray-700 dark:text-gray-300 italic mb-6 text-lg">"{testimonial.comment}"</p>

            <div className="flex items-center gap-4 mb-4">
                <img
                    src={getImageUrl(testimonial.image)}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.company}</p>
                </div>
            </div>

            {showActions && (onEdit || onDelete) && (
                <div className="flex gap-3 mt-6">
                    {onEdit && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => onEdit(testimonial)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
                        >
                            <Edit2 size={18} /> Edit
                        </motion.button>
                    )}
                    {onDelete && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => onDelete(testimonial._id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                        >
                            <Trash2 size={18} /> Delete
                        </motion.button>
                    )}
                </div>
            )}
        </motion.div>
    );
};
