import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/Dashboard';
import Analytics from './admin/Analytics';
import NotificationSettings from './admin/NotificationSettings';
import CreateBlog from './admin/CreateBlog';
import { AdminUserProfile, AdminUsers } from './admin/AdminUsers';
import { AdminBlogs, AdminDemoSessions, AdminMessages, AdminServices, AdminTestimonials } from './admin/Pages';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, checkAuth, loading } = useContext(AuthContext);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AdminRoutes = () => {
    const { checkAuth } = useContext(AuthContext);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserProfile />} />
                <Route path="settings/notifications" element={<NotificationSettings />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="blogs/create" element={<CreateBlog />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="demo-sessions" element={<AdminDemoSessions />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AppProvider>
                <AuthProvider>
                    <Router>
                        <AdminRoutes />
                    </Router>
                </AuthProvider>
            </AppProvider>
        </ThemeProvider>
    );
}

export default App;
