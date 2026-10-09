import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';
import { ServiceForm, BlogForm, TestimonialForm } from '../components/Forms';
import { BlogCard, ServiceCard, TestimonialCard } from '../components/Cards';
import { getImageUrl } from '../services/api';
import { Calendar, Edit2, Grid, List, Plus, Star, Trash2 } from 'react-feather';

const AdminTable = ({ columns, rows, isDark, emptyMessage }) => {
    const cellClass = `px-5 py-4 align-top text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

    if (!rows.length) {
        return (
            <div className={`rounded-xl border px-6 py-12 text-center ${isDark ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-white text-gray-600'}`}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto rounded-xl border shadow-sm ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className={isDark ? 'bg-gray-900/70' : 'bg-gray-50'}>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={`whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {rows.map((row) => (
                        <tr key={row.id} className={isDark ? 'hover:bg-gray-700/40' : 'hover:bg-gray-50'}>
                            {columns.map((column) => (
                                <td key={column.key} className={cellClass}>
                                    {column.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AdminRowActions = ({ onEdit, onDelete, itemName, isDark }) => (
    <div className="flex items-center gap-2">
        {onEdit && (
            <button
                type="button"
                onClick={onEdit}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium transition ${isDark ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/60' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                aria-label={`Edit ${itemName}`}
            >
                <Edit2 size={15} /> Edit
            </button>
        )}
        {onDelete && (
            <button
                type="button"
                onClick={onDelete}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium transition ${isDark ? 'bg-red-900/30 text-red-300 hover:bg-red-900/60' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                aria-label={`Delete ${itemName}`}
            >
                <Trash2 size={15} /> Delete
            </button>
        )}
    </div>
);

const formatAdminDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';
const plainAdminText = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();

const AdminViewToggle = ({ viewMode, onToggle, isDark }) => (
    <button
        type="button"
        onClick={onToggle}
        title={viewMode === 'rows' ? 'Switch to card view' : 'Switch to row view'}
        aria-label={viewMode === 'rows' ? 'Switch to card view' : 'Switch to row view'}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border transition ${isDark ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}`}
    >
        {viewMode === 'rows' ? <Grid size={19} /> : <List size={19} />}
    </button>
);

// Services Admin Page
export const AdminServices = () => {
    const { services, addService, updateService, deleteService } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('rows');

    const handleAdd = async (formData) => {
        await addService(formData);
        setIsAdding(false);
    };

    const handleUpdate = async (formData) => {
        await updateService(editingId, formData);
        setEditingId(null);
    };

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Services</h1>
                    <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Upload a service image and preview how it will appear on your website.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <AdminViewToggle viewMode={viewMode} isDark={isDark} onToggle={() => setViewMode((mode) => mode === 'rows' ? 'cards' : 'rows')} />
                    {!isAdding && !editingId && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 hover:shadow-lg"
                        >
                            <Plus size={20} /> Add Service
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <ServiceForm
                        initial={editingId ? services.find(s => s._id === editingId) : null}
                        onSubmit={editingId ? handleUpdate : handleAdd}
                        onCancel={() => {
                            setIsAdding(false);
                            setEditingId(null);
                        }}
                    />
                </motion.div>
            )}

            {viewMode === 'rows' ? (
                <AdminTable
                isDark={isDark}
                emptyMessage="No services yet. Add your first service to see it here."
                rows={services.map((service) => ({ ...service, id: service._id }))}
                columns={[
                    {
                        key: 'service',
                        label: 'Service',
                        render: (service) => (
                            <div className="flex min-w-56 items-center gap-3">
                                {service.image ? (
                                    <img src={getImageUrl(service.image)} alt="" className="h-11 w-14 rounded-md object-cover" />
                                ) : (
                                    <div className={`flex h-11 w-14 items-center justify-center rounded-md text-xs font-semibold ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>Service</div>
                                )}
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.title}</span>
                            </div>
                        ),
                    },
                    { key: 'category', label: 'Category', render: (service) => service.category || '—' },
                    {
                        key: 'description',
                        label: 'Description',
                        render: (service) => <span className="block max-w-md line-clamp-2">{service.description || '—'}</span>,
                    },
                    {
                        key: 'actions',
                        label: 'Actions',
                        render: (service) => (
                            <AdminRowActions
                                itemName={service.title}
                                isDark={isDark}
                                onEdit={() => {
                                    setIsAdding(false);
                                    setEditingId(service._id);
                                }}
                                onDelete={() => deleteService(service._id)}
                            />
                        ),
                    },
                ]}
            />) : (
                services.length ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {services.map((service) => (
                            <ServiceCard
                                key={service._id}
                                service={service}
                                onEdit={() => {
                                    setIsAdding(false);
                                    setEditingId(service._id);
                                }}
                                onDelete={deleteService}
                            />
                        ))}
                    </div>
                ) : <div className={`rounded-xl border px-6 py-12 text-center ${isDark ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-white text-gray-600'}`}>No services yet. Add your first service to see it here.</div>
            )}
        </div>
    );
};

// Blogs Admin Page
export const AdminBlogs = () => {
    const navigate = useNavigate();
    const { blogs, updateBlog, deleteBlog } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('rows');

    const handleUpdate = async (formData) => {
        await updateBlog(editingId, formData);
        setEditingId(null);
    };

    const handleDeleteBlog = (blogId) => {
        if (window.confirm('Are you sure? This blog will be permanently deleted.')) {
            deleteBlog(blogId);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Blogs</h1>
                <div className="flex items-center gap-3">
                    <AdminViewToggle viewMode={viewMode} isDark={isDark} onToggle={() => setViewMode((mode) => mode === 'rows' ? 'cards' : 'rows')} />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('create')}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition"
                    >
                        <Plus size={20} /> Create Blog
                    </motion.button>
                </div>
            </div>

            {/* Edit Form */}
            {editingId && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <BlogForm
                        initial={blogs.find(b => b._id === editingId)}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingId(null)}
                    />
                </motion.div>
            )}

            {viewMode === 'rows' ? (
                <AdminTable
                isDark={isDark}
                emptyMessage="No blogs created yet. Create your first blog to see it here."
                rows={blogs.map((blog) => ({ ...blog, id: blog._id }))}
                columns={[
                    {
                        key: 'title',
                        label: 'Blog',
                        render: (blog) => (
                            <div className="flex min-w-56 items-center gap-3">
                                {blog.image ? (
                                    <img src={getImageUrl(blog.image)} alt="" className="h-11 w-14 rounded-md object-cover" />
                                ) : (
                                    <div className={`flex h-11 w-14 items-center justify-center rounded-md text-xs font-semibold ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>Blog</div>
                                )}
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{blog.title}</span>
                            </div>
                        ),
                    },
                    { key: 'category', label: 'Category', render: (blog) => blog.category || '—' },
                    { key: 'date', label: 'Publish date', render: (blog) => formatAdminDate(blog.date) },
                    { key: 'views', label: 'Views', render: (blog) => Number(blog.views || 0).toLocaleString() },
                    {
                        key: 'actions',
                        label: 'Actions',
                        render: (blog) => (
                            <AdminRowActions
                                itemName={blog.title}
                                isDark={isDark}
                                onEdit={() => setEditingId(blog._id)}
                                onDelete={() => handleDeleteBlog(blog._id)}
                            />
                        ),
                    },
                ]}
            />
            ) : (
                blogs.length ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {blogs.map((blog) => (
                            <BlogCard
                                key={blog._id}
                                blog={blog}
                                showActions
                                onEdit={() => setEditingId(blog._id)}
                                onDelete={handleDeleteBlog}
                            />
                        ))}
                    </div>
                ) : <div className={`rounded-xl border px-6 py-12 text-center ${isDark ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-white text-gray-600'}`}>No blogs created yet. Create your first blog to see it here.</div>
            )}
        </div>
    );
};

// Testimonials Admin Page
export const AdminTestimonials = () => {
    const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('rows');

    const handleAdd = async (formData) => {
        await addTestimonial(formData);
        setIsAdding(false);
    };

    const handleUpdate = async (formData) => {
        await updateTestimonial(editingId, formData);
        setEditingId(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Testimonials</h1>
                <div className="flex items-center gap-3">
                    <AdminViewToggle viewMode={viewMode} isDark={isDark} onToggle={() => setViewMode((mode) => mode === 'rows' ? 'cards' : 'rows')} />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium hover:shadow-lg transition"
                    >
                        <Plus size={20} /> Add Testimonial
                    </motion.button>
                </div>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <TestimonialForm
                        initial={editingId ? testimonials.find(t => t._id === editingId) : null}
                        onSubmit={editingId ? handleUpdate : handleAdd}
                        onCancel={() => {
                            setIsAdding(false);
                            setEditingId(null);
                        }}
                    />
                </motion.div>
            )}

            {viewMode === 'rows' ? (
                <AdminTable
                isDark={isDark}
                emptyMessage="No testimonials yet. Add your first testimonial to see it here."
                rows={testimonials.map((testimonial) => ({ ...testimonial, id: testimonial._id }))}
                columns={[
                    {
                        key: 'customer',
                        label: 'Customer',
                        render: (testimonial) => (
                            <div className="flex min-w-48 items-center gap-3">
                                {testimonial.image ? (
                                    <img src={getImageUrl(testimonial.image)} alt="" className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                        {(testimonial.name || '?').slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</p>
                                    <p className="text-xs text-gray-500">{testimonial.company || '—'}</p>
                                </div>
                            </div>
                        ),
                    },
                    {
                        key: 'rating',
                        label: 'Rating',
                        render: (testimonial) => (
                            <span className="inline-flex items-center gap-1 text-amber-500">
                                <Star size={15} fill="currentColor" /> {testimonial.rating || 0}/5
                            </span>
                        ),
                    },
                    {
                        key: 'review',
                        label: 'Review',
                        render: (testimonial) => <span className="block max-w-lg line-clamp-2">{testimonial.review || testimonial.comment || '—'}</span>,
                    },
                    {
                        key: 'actions',
                        label: 'Actions',
                        render: (testimonial) => (
                            <AdminRowActions
                                itemName={testimonial.name}
                                isDark={isDark}
                                onEdit={() => setEditingId(testimonial._id)}
                                onDelete={() => deleteTestimonial(testimonial._id)}
                            />
                        ),
                    },
                ]}
                />
            ) : (
                testimonials.length ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard
                                key={testimonial._id}
                                testimonial={{ ...testimonial, comment: testimonial.comment || testimonial.review }}
                                showActions
                                onEdit={() => setEditingId(testimonial._id)}
                                onDelete={deleteTestimonial}
                            />
                        ))}
                    </div>
                ) : <div className={`rounded-xl border px-6 py-12 text-center ${isDark ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-white text-gray-600'}`}>No testimonials yet. Add your first testimonial to see it here.</div>
            )}
        </div>
    );
};

// Messages Admin Page
export const AdminMessages = () => {
    const { contactMessages = [], deleteContactMessage, fetchContactMessages } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const [viewMode, setViewMode] = React.useState('rows');
    const messages = contactMessages.filter((message) => message.requestType !== 'demo');

    // Fetch contact messages when component mounts
    React.useEffect(() => {
        fetchContactMessages();
    }, [fetchContactMessages]);

    const handleDeleteMessage = (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            deleteContactMessage(id);
        }
    };

    if (!contactMessages) {
        return (
            <div>
                <h1 className={`text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Messages</h1>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading messages...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between gap-4">
                <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Messages</h1>
                <AdminViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {viewMode === 'rows' ? (
                <AdminTable
                    isDark={isDark}
                    emptyMessage="No contact messages yet."
                    rows={messages.map((message) => ({ ...message, id: message._id || message.id }))}
                    columns={[
                        {
                            key: 'sender',
                            label: 'From',
                            render: (message) => (
                                <div className="min-w-44">
                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{message.name || 'Unknown'}</p>
                                    <a href={`mailto:${message.email}`} className="text-indigo-500 hover:underline">{message.email}</a>
                                </div>
                            ),
                        },
                        { key: 'subject', label: 'Subject', render: (message) => message.subject || '—' },
                        {
                            key: 'message',
                            label: 'Message',
                            render: (message) => <span className="block max-w-lg line-clamp-2 whitespace-pre-line">{message.message || '—'}</span>,
                        },
                        { key: 'date', label: 'Received', render: (message) => formatAdminDate(message.createdAt) },
                        {
                            key: 'actions',
                            label: 'Actions',
                            render: (message) => (
                                <AdminRowActions
                                    itemName={`message from ${message.name || message.email}`}
                                    isDark={isDark}
                                    onDelete={() => handleDeleteMessage(message._id || message.id)}
                                />
                            ),
                        },
                    ]}
                />
            ) : messages.length ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {messages.map((message) => (
                        <article key={message._id || message.id} className={`rounded-xl border p-5 shadow-sm ${isDark ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white text-gray-700'}`}>
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className={`truncate text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{message.subject || 'No subject'}</h2>
                                    <p className="mt-1 text-sm">{message.name || 'Unknown'}</p>
                                    <a href={`mailto:${message.email}`} className="text-sm text-indigo-500 hover:underline">{message.email}</a>
                                </div>
                                <AdminRowActions
                                    itemName={`message from ${message.name || message.email}`}
                                    isDark={isDark}
                                    onDelete={() => handleDeleteMessage(message._id || message.id)}
                                />
                            </div>
                            <p className="whitespace-pre-line break-words text-sm">{message.message || '—'}</p>
                            <p className={`mt-4 border-t pt-3 text-xs ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                                Received {formatAdminDate(message.createdAt)}
                            </p>
                        </article>
                    ))}
                </div>
            ) : (
                <div className={`rounded-xl border px-6 py-12 text-center ${isDark ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 bg-white text-gray-600'}`}>No contact messages yet.</div>
            )}
        </div>
    );
};

export const AdminDemoSessions = () => {
    const { contactMessages = [], deleteContactMessage, fetchContactMessages } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);
    const demoSessions = contactMessages.filter((message) => message.requestType === 'demo');

    React.useEffect(() => {
        fetchContactMessages();
    }, [fetchContactMessages]);

    const handleDeleteRequest = (id) => {
        if (window.confirm('Are you sure you want to delete this demo request?')) {
            deleteContactMessage(id);
        }
    };

    const heading = isDark ? 'text-white' : 'text-gray-900';
    const muted = isDark ? 'text-gray-400' : 'text-gray-600';

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className={`text-3xl font-bold sm:text-4xl ${heading}`}>Demo Sessions</h1>
                    <p className={`mt-2 ${muted}`}>Review customer requests and their preferred meeting times.</p>
                </div>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {demoSessions.length} {demoSessions.length === 1 ? 'request' : 'requests'}
                </span>
            </div>

            {demoSessions.length > 0 ? (
                <div className="grid gap-5 xl:grid-cols-2">
                    {demoSessions.map((session, index) => (
                        <motion.article
                            key={session._id || session.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                        Demo request
                                    </span>
                                    <h2 className={`mt-3 text-xl font-bold ${heading}`}>{session.name}</h2>
                                    <a href={`mailto:${session.email}`} className="mt-1 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400">{session.email}</a>
                                    {session.phone && <p className={`mt-1 text-sm ${muted}`}>{session.phone}</p>}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteRequest(session._id || session.id)}
                                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/30"
                                    title="Delete demo request"
                                    aria-label={`Delete demo request from ${session.name}`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <dl className={`mt-5 grid grid-cols-1 gap-3 rounded-xl p-4 text-sm sm:grid-cols-2 ${isDark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
                                <div>
                                    <dt className={muted}>Service</dt>
                                    <dd className={`mt-1 font-semibold ${heading}`}>{session.service || 'Not specified'}</dd>
                                </div>
                                <div>
                                    <dt className={muted}>Preferred date & time</dt>
                                    <dd className={`mt-1 font-semibold ${heading}`}>
                                        {session.preferredDate || 'Not specified'}{session.preferredTime ? ` · ${session.preferredTime}` : ''}
                                    </dd>
                                </div>
                                {session.company && (
                                    <div className="sm:col-span-2">
                                        <dt className={muted}>Company</dt>
                                        <dd className={`mt-1 font-semibold ${heading}`}>{session.company}</dd>
                                    </div>
                                )}
                            </dl>
                            {session.message && (
                                <p className={`mt-4 whitespace-pre-line text-sm leading-6 ${muted}`}>{session.message}</p>
                            )}
                            <p className={`mt-4 text-xs ${muted}`}>
                                Received {session.createdAt ? new Date(session.createdAt).toLocaleString() : 'date unavailable'}
                            </p>
                        </motion.article>
                    ))}
                </div>
            ) : (
                <div className={`rounded-2xl border px-6 py-16 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                    <Calendar className={`mx-auto mb-4 ${muted}`} size={32} />
                    <h2 className={`text-lg font-semibold ${heading}`}>No demo requests yet</h2>
                    <p className={`mt-2 text-sm ${muted}`}>New requests from the Book Demo form will appear here.</p>
                </div>
            )}
        </div>
    );
};
