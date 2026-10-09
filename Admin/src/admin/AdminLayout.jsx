import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Layout, BarChart2, Briefcase, BookOpen, MessageSquare, Mail, Bell, Users, Moon, Sun, X as XIcon, Calendar } from 'react-feather';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { AppContext } from '../context/AppContext';

export const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [requestNotification, setRequestNotification] = useState(null);
    const seenRequestIds = useRef(null);
    const location = useLocation();
    const { adminUser } = useContext(AuthContext);
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const { contactMessages, fetchContactMessages, getNotificationSettings } = useContext(AppContext);
    const demoSessions = contactMessages.filter((message) => message.requestType === 'demo');

    const menuItems = [
        { icon: Layout, label: 'Dashboard', href: '/admin' },
        { icon: BarChart2, label: 'Analytics', href: '/admin/analytics' },
        { icon: Briefcase, label: 'Services', href: '/admin/services' },
        { icon: BookOpen, label: 'Blogs', href: '/admin/blogs' },
        { icon: MessageSquare, label: 'Testimonials', href: '/admin/testimonials' },
        { icon: Mail, label: 'Messages', href: '/admin/messages' },
        { icon: Calendar, label: 'Demo Sessions', href: '/admin/demo-sessions', badge: demoSessions.length },
        { icon: Users, label: 'Admin Users', href: '/admin/users' },
        { icon: Bell, label: 'Notifications', href: '/admin/settings/notifications' },
    ];

    const isActive = (href) => location.pathname === href || (href !== '/admin' && location.pathname.startsWith(`${href}/`));
    const currentPage = menuItems.find((item) => isActive(item.href))?.label || 'Admin';

    useEffect(() => {
        let active = true;
        let intervalId;

        const refreshNotifications = async () => {
            try {
                const [messages, settingsResponse] = await Promise.all([
                    fetchContactMessages(),
                    getNotificationSettings(),
                ]);
                if (!active || !messages || !settingsResponse?.settings) return;

                const currentMessages = messages.filter((message) => message._id);
                const currentIds = new Set(currentMessages.map((message) => message._id));

                if (seenRequestIds.current === null) {
                    seenRequestIds.current = currentIds;
                    return;
                }

                const newRequest = currentMessages.find((message) => !seenRequestIds.current.has(message._id));
                seenRequestIds.current = currentIds;
                if (newRequest && settingsResponse.settings.inAppEnabled !== false) {
                    setRequestNotification(newRequest);
                    window.setTimeout(() => setRequestNotification(null), 8000);
                }
            } catch (error) {
                console.error('Could not refresh admin notifications:', error);
            }
        };

        refreshNotifications();
        intervalId = window.setInterval(refreshNotifications, 30000);

        return () => {
            active = false;
            window.clearInterval(intervalId);
        };
    }, [fetchContactMessages, getNotificationSettings]);

    return (
        <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-300`}>
            {/* Sidebar */}
            <motion.div
                animate={{ width: sidebarOpen ? 280 : 80 }}
                className={`${isDark ? 'bg-slate-950 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'} flex h-screen shrink-0 flex-col border-r shadow-xl shadow-slate-950/5 overflow-hidden transition-colors duration-300`}
            >
                <div className={`p-5 flex items-center justify-between ${isDark ? 'border-b border-slate-800' : 'border-b border-slate-100'}`}>
                    {sidebarOpen && <div className="flex items-center gap-2">
                        <img
                            src="/favicon.jpeg"
                            alt="Arviora"
                            className="h-9 w-9 shrink-0 rounded-xl bg-white object-contain p-0.5 shadow-md"
                        />
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-brand-primary">Arviora</h2>
                            <p className={`text-[10px] uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Admin studio</p>
                        </div>
                    </div>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="mt-7 flex-1 space-y-1.5 overflow-y-auto px-3 pb-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            title={sidebarOpen ? undefined : item.label}
                            aria-label={!sidebarOpen && item.badge > 0 ? `${item.label}, ${item.badge} requests` : undefined}
                            className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${sidebarOpen ? '' : 'justify-center'} ${isActive(item.href)
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                : isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={18} className="shrink-0" />
                                {sidebarOpen && <span className="flex-1">{item.label}</span>}
                                {item.badge > 0 && (
                                    <span className={`flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${sidebarOpen ? '' : 'absolute -right-1 -top-1 ring-2'} ${isActive(item.href) ? 'bg-white/20 text-white ring-indigo-600' : `bg-indigo-600 text-white ${isDark ? 'ring-slate-950' : 'ring-white'}`}`}>
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                        </Link>
                    ))}
                </nav>

                <Link
                    to={adminUser?.id ? `/admin/users/${adminUser.id}` : '/admin/users'}
                    title={sidebarOpen ? undefined : 'My profile'}
                    className={`mx-3 mb-4 mt-2 flex items-center gap-3 rounded-xl border p-3 transition ${sidebarOpen ? '' : 'justify-center'} ${isDark ? 'border-slate-800 bg-slate-900 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                >
                    {adminUser?.profilePicture ? (
                        <img src={adminUser.profilePicture} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                    ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                            {(adminUser?.name || adminUser?.email || 'A').slice(0, 1).toUpperCase()}
                        </span>
                    )}
                    {sidebarOpen && (
                        <span className="min-w-0 flex-1">
                            <span className={`block truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{adminUser?.name || 'Admin'}</span>
                            <span className={`block truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{adminUser?.email}</span>
                            <span className={`mt-0.5 block text-[10px] capitalize ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{adminUser?.role || 'admin'} profile</span>
                        </span>
                    )}
                </Link>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col">
                {requestNotification && (
                    <div role="status" className="fixed right-5 top-20 z-40 w-[min(24rem,calc(100vw-2.5rem))] rounded-xl border border-indigo-200 bg-white p-4 shadow-xl dark:border-indigo-800 dark:bg-slate-900">
                        <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                {requestNotification.requestType === 'demo' ? <Calendar size={18} /> : <Mail size={18} />}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {requestNotification.requestType === 'demo' ? 'New demo request' : 'New contact message'}
                                </p>
                                <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    {requestNotification.requestType === 'demo'
                                        ? `${requestNotification.name} requested a demo for ${requestNotification.service || 'a service'}.`
                                        : `${requestNotification.name} sent a new contact message.`}
                                </p>
                                <Link
                                    to={requestNotification.requestType === 'demo' ? '/admin/demo-sessions' : '/admin/messages'}
                                    onClick={() => setRequestNotification(null)}
                                    className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                >
                                    {requestNotification.requestType === 'demo' ? 'View demo sessions' : 'View messages'}
                                </Link>
                            </div>
                            <button type="button" onClick={() => setRequestNotification(null)} aria-label="Dismiss notification" className={`rounded p-1 ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
                                <XIcon size={16} />
                            </button>
                        </div>
                    </div>
                )}
                {/* Top Header */}
                <div className={`${isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'} sticky top-0 z-20 border-b backdrop-blur-xl px-5 md:px-8 py-4 flex justify-between items-center transition-colors duration-300`}>
                    <div>
                        <p className={`text-[11px] uppercase tracking-[0.18em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Arviora workspace</p>
                        <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentPage}</h1>
                    </div>

                    {/* Right side: Theme toggle */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Theme Toggle Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'}`}
                            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? (
                                <Sun size={20} className="text-yellow-400" />
                            ) : (
                                <Moon size={20} className="text-indigo-600" />
                            )}
                        </motion.button>

                    </div>
                </div>
                <div className={`flex-1 p-5 md:p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-300 overflow-auto`}>
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default AdminLayout;
