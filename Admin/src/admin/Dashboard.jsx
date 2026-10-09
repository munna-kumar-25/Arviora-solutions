import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, BarChart2, BookOpen, Briefcase, Calendar, Mail, MessageSquare, Plus } from 'react-feather';
import { AppContext } from '../context/AppContext';
import { ThemeContext } from '../context/ThemeContext';

const AdminDashboard = () => {
    const { services, blogs, testimonials, contactMessages, fetchContactMessages } = useContext(AppContext);
    const { isDark } = useContext(ThemeContext);

    useEffect(() => {
        fetchContactMessages();
    }, [fetchContactMessages]);

    const stats = [
        { label: 'Services', value: services.length, icon: Briefcase, color: '#38bdf8', background: 'bg-sky-500/10' },
        { label: 'Blog posts', value: blogs.length, icon: BookOpen, color: '#34d399', background: 'bg-emerald-500/10' },
        { label: 'Testimonials', value: testimonials.length, icon: MessageSquare, color: '#a78bfa', background: 'bg-violet-500/10' },
        { label: 'Messages', value: contactMessages.filter((message) => message.requestType !== 'demo').length, icon: Mail, color: '#fb923c', background: 'bg-orange-500/10' },
        { label: 'Demo sessions', value: contactMessages.filter((message) => message.requestType === 'demo').length, icon: Calendar, color: '#818cf8', background: 'bg-indigo-500/10' },
    ];
    const card = isDark ? 'border-slate-800 bg-slate-900/75' : 'border-slate-200 bg-white';
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';

    return (
        <div className="mx-auto max-w-7xl space-y-6 pb-10">
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-950/10 md:p-8"
            >
                <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border-[32px] border-white/5" />
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-indigo-100">
                            <Activity size={14} /> Admin overview
                        </span>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Your workspace, at a glance.</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                            Manage your website content and keep up with incoming enquiries from one place.
                        </p>
                    </div>
                    <Link
                        to="/admin/analytics"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
                    >
                        <BarChart2 size={17} /> View analytics <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {stats.map((stat, index) => (
                    <motion.article
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${card}`}
                    >
                        <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${muted}`}>{stat.label}</p>
                            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.background}`}>
                                <stat.icon size={18} style={{ color: stat.color }} />
                            </span>
                        </div>
                        <p className={`mt-4 text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {Number(stat.value || 0).toLocaleString()}
                        </p>
                        <p className={`mt-1 text-xs ${muted}`}>Total records</p>
                    </motion.article>
                ))}
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                <div className={`rounded-2xl border p-5 shadow-sm md:p-6 ${card}`}>
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Latest enquiries</h3>
                            <p className={`mt-1 text-xs ${muted}`}>Recent messages received through your website</p>
                        </div>
                        <Link to="/admin/messages" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-400">
                            All messages <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                        {contactMessages.slice(0, 5).map((message) => (
                            <div key={message._id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                                    {(message.name || '?').slice(0, 1).toUpperCase()}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-1">
                                        <p className={`truncate text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{message.name}</p>
                                        <time className={`text-xs ${muted}`} dateTime={message.createdAt}>
                                            {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : ''}
                                        </time>
                                    </div>
                                    <p className={`truncate text-xs ${muted}`}>{message.email}</p>
                                    <p className={`mt-1 line-clamp-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{message.message}</p>
                                </div>
                            </div>
                        ))}
                        {contactMessages.length === 0 && (
                            <p className={`py-10 text-center text-sm ${muted}`}>No enquiries yet. New messages will appear here.</p>
                        )}
                    </div>
                </div>

                <div className={`rounded-2xl border p-5 shadow-sm md:p-6 ${card}`}>
                    <div className="mb-5">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick actions</h3>
                        <p className={`mt-1 text-xs ${muted}`}>Jump back into your day-to-day work</p>
                    </div>
                    <div className="space-y-3">
                        <Link to="/admin/blogs/create" className={`flex items-center gap-3 rounded-xl border p-4 transition hover:border-indigo-500/40 ${isDark ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"><Plus size={19} /></span>
                            <span className="min-w-0 flex-1">
                                <span className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Create a blog post</span>
                                <span className={`mt-0.5 block text-xs ${muted}`}>Share a new story or update</span>
                            </span>
                            <ArrowRight size={16} className={muted} />
                        </Link>
                        <Link to="/admin/analytics" className={`flex items-center gap-3 rounded-xl border p-4 transition hover:border-indigo-500/40 ${isDark ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500"><BarChart2 size={19} /></span>
                            <span className="min-w-0 flex-1">
                                <span className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Generate a report</span>
                                <span className={`mt-0.5 block text-xs ${muted}`}>Filter activity and export CSV</span>
                            </span>
                            <ArrowRight size={16} className={muted} />
                        </Link>
                        <Link to="/admin/services" className={`flex items-center gap-3 rounded-xl border p-4 transition hover:border-indigo-500/40 ${isDark ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500"><Briefcase size={19} /></span>
                            <span className="min-w-0 flex-1">
                                <span className={`block text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Manage services</span>
                                <span className={`mt-0.5 block text-xs ${muted}`}>Review your service catalogue</span>
                            </span>
                            <ArrowRight size={16} className={muted} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
