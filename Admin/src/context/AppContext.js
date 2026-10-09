import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AppContext = createContext();

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Helper Functions
const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
    try {
        const token = localStorage.getItem('token');
        const options = {
            method,
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        if (body && !isFormData) {
            options.body = JSON.stringify(body);
        } else if (body && isFormData) {
            options.body = body; // FormData for file uploads
        }

        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            // Create error object with backend response data
            const error = new Error(data.message || 'API Error');
            error.response = { data }; // Store full response for validation errors
            throw error;
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
};

export const AppProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Services, Blogs, and Testimonials from backend (public data)
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [servicesRes, blogsRes, testimonialsRes] = await Promise.all([
                apiCall('/services'),
                apiCall('/blogs?limit=1000'),
                apiCall('/testimonials')
            ]);

            setServices(servicesRes.services || []);
            setBlogs(blogsRes.blogs || []);
            setTestimonials(testimonialsRes.testimonials || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch all data from backend on component mount
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Fetch contact messages (admin only - called separately when needed)
    const fetchContactMessages = useCallback(async () => {
        try {
            const response = await apiCall('/contact?limit=1000');
            const messages = response.contacts || [];
            setContactMessages(messages);
            return messages;
        } catch (err) {
            setError(err.message);
            console.error('Error fetching contact messages:', err);
            return null;
        }
    }, []);

    const getAnalyticsReport = useCallback(({ from, to, metrics }) => {
        const params = new URLSearchParams({
            from,
            to,
            metrics: metrics.join(','),
        });
        return apiCall(`/analytics?${params.toString()}`);
    }, []);

    const getNotificationSettings = useCallback(() => apiCall('/auth/notifications'), []);
    const updateNotificationSettings = useCallback((settings) => apiCall('/auth/notifications', 'PUT', settings), []);
    const sendTestNotificationEmail = useCallback((email) => apiCall('/auth/notifications/test', 'POST', { email }), []);
    const getUnreadMessageCount = useCallback(() => apiCall('/contact/stats/unread'), []);

    // SERVICE OPERATIONS - All sync with backend API
    const addService = useCallback(async (serviceData) => {
        try {
            const formData = new FormData();

            // Add all fields except imagePreview
            Object.keys(serviceData).forEach(key => {
                if (key === 'imagePreview' || key === 'topFeatures') {
                    // Skip preview, only send actual file
                    return;
                }

                if (key === 'features') {
                    const features = Array.isArray(serviceData[key])
                        ? serviceData[key]
                        : serviceData[key] ? serviceData[key].split(',').map(title => ({ title: title.trim(), description: '' })) : [];
                    formData.append(key, JSON.stringify(features));
                } else if (key === 'benefits') {
                    const array = serviceData[key] ? serviceData[key].split(',').map(item => item.trim()) : [];
                    formData.append(key, JSON.stringify(array));
                } else if (serviceData[key] !== null && serviceData[key] !== undefined) {
                    formData.append(key, serviceData[key]);
                }
            });

            const topFeatureImageIndexes = [];
            const topFeatures = serviceData.topFeatures.map((feature, index) => {
                if (feature.imageFile) {
                    formData.append('topFeatureImages', feature.imageFile);
                    topFeatureImageIndexes.push(index);
                }
                return {
                    title: feature.title,
                    description: feature.description,
                    image: feature.image || null,
                };
            });
            formData.append('topFeatures', JSON.stringify(topFeatures));
            formData.append('topFeatureImageIndexes', JSON.stringify(topFeatureImageIndexes));

            const result = await apiCall('/services', 'POST', formData, true);
            setServices([...services, result.service]);
            return result.service;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [services]);

    const updateService = useCallback(async (id, updatedData) => {
        try {
            const formData = new FormData();

            // Add all fields except imagePreview
            Object.keys(updatedData).forEach(key => {
                if (key === 'imagePreview' || key === 'topFeatures') {
                    // Skip preview, only send actual file
                    return;
                }

                if (key === 'features') {
                    const features = Array.isArray(updatedData[key])
                        ? updatedData[key]
                        : updatedData[key] ? updatedData[key].split(',').map(title => ({ title: title.trim(), description: '' })) : [];
                    formData.append(key, JSON.stringify(features));
                } else if (key === 'benefits') {
                    let benefits = [];
                    if (typeof updatedData[key] === 'string') {
                        benefits = updatedData[key].split(',').map(item => item.trim());
                    } else if (Array.isArray(updatedData[key])) {
                        benefits = updatedData[key];
                    }
                    formData.append(key, JSON.stringify(benefits));
                } else if (updatedData[key] !== null && updatedData[key] !== undefined) {
                    formData.append(key, updatedData[key]);
                }
            });

            const topFeatureImageIndexes = [];
            const topFeatures = updatedData.topFeatures.map((feature, index) => {
                if (feature.imageFile) {
                    formData.append('topFeatureImages', feature.imageFile);
                    topFeatureImageIndexes.push(index);
                }
                return {
                    title: feature.title,
                    description: feature.description,
                    image: feature.image || null,
                };
            });
            formData.append('topFeatures', JSON.stringify(topFeatures));
            formData.append('topFeatureImageIndexes', JSON.stringify(topFeatureImageIndexes));

            const result = await apiCall(`/services/${id}`, 'PUT', formData, true);
            setServices(services.map(s => s._id === id ? result.service : s));
            return result.service;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [services]);

    const deleteService = useCallback(async (id) => {
        try {
            await apiCall(`/services/${id}`, 'DELETE');
            setServices(services.filter(s => s._id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [services]);

    // BLOG OPERATIONS - All sync with backend API
    const addBlog = useCallback(async (blogData) => {
        try {
            // Prepare blog data using FormData to handle file uploads
            const formData = new FormData();

            // Add all fields except imagePreview
            Object.keys(blogData).forEach(key => {
                if (key === 'imagePreview') {
                    // Skip preview, only send actual file
                    return;
                }

                if (key === 'tags') {
                    // Convert comma-separated strings to arrays if needed
                    const array = blogData[key]
                        ? (Array.isArray(blogData[key])
                            ? blogData[key]
                            : blogData[key].split(',').map(item => item.trim()))
                        : [];
                    formData.append(key, JSON.stringify(array));
                } else if (Array.isArray(blogData[key])) {
                    formData.append(key, JSON.stringify(blogData[key]));
                } else if (blogData[key] !== null && blogData[key] !== undefined) {
                    // For File objects and other fields
                    formData.append(key, blogData[key]);
                }
            });

            console.log('Sending blog data with FormData');

            // Send as FormData to properly handle file uploads
            const result = await apiCall('/blogs', 'POST', formData, true);
            setBlogs([...blogs, result.blog]);
            return result.blog;
        } catch (err) {
            console.error('Blog creation error:', err);
            setError(err.message);
            throw err;
        }
    }, [blogs]);

    const updateBlog = useCallback(async (id, updatedData) => {
        try {
            const formData = new FormData();

            // Add all fields except imagePreview
            Object.keys(updatedData).forEach(key => {
                if (key === 'imagePreview') {
                    // Skip preview, only send actual file
                    return;
                }

                if (key === 'tags') {
                    // Convert comma-separated strings to arrays if needed
                    const array = updatedData[key]
                        ? (Array.isArray(updatedData[key])
                            ? updatedData[key]
                            : updatedData[key].split(',').map(item => item.trim()))
                        : [];
                    formData.append(key, JSON.stringify(array));
                } else if (Array.isArray(updatedData[key])) {
                    formData.append(key, JSON.stringify(updatedData[key]));
                } else if (updatedData[key] !== null && updatedData[key] !== undefined) {
                    formData.append(key, updatedData[key]);
                }
            });

            const result = await apiCall(`/blogs/${id}`, 'PUT', formData, true);
            setBlogs(blogs.map(b => b._id === id ? result.blog : b));
            return result.blog;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [blogs]);

    const deleteBlog = useCallback(async (id) => {
        try {
            await apiCall(`/blogs/${id}`, 'DELETE');
            setBlogs(blogs.filter(b => b._id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [blogs]);

    const getBlogById = useCallback((id) => {
        return blogs.find(b => b._id === id || b.id === parseInt(id));
    }, [blogs]);

    // TESTIMONIAL OPERATIONS - All sync with backend API
    const addTestimonial = useCallback(async (testimonialData) => {
        try {
            const formData = new FormData();

            // Add all fields except imagePreview
            Object.keys(testimonialData).forEach(key => {
                if (key === 'imagePreview') {
                    // Skip preview, only send actual file
                    return;
                }

                if (testimonialData[key] !== null && testimonialData[key] !== undefined) {
                    formData.append(key, testimonialData[key]);
                }
            });

            const result = await apiCall('/testimonials', 'POST', formData, true);
            setTestimonials([...testimonials, result.testimonial]);
            return result.testimonial;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [testimonials]);

    const updateTestimonial = useCallback(async (id, updatedData) => {
        try {
            const formData = new FormData();

            // Add all fields except imagePreview
            Object.keys(updatedData).forEach(key => {
                if (key === 'imagePreview') {
                    // Skip preview, only send actual file
                    return;
                }

                if (updatedData[key] !== null && updatedData[key] !== undefined) {
                    formData.append(key, updatedData[key]);
                }
            });

            const result = await apiCall(`/testimonials/${id}`, 'PUT', formData, true);
            setTestimonials(testimonials.map(t => t._id === id ? result.testimonial : t));
            return result.testimonial;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [testimonials]);

    const deleteTestimonial = useCallback(async (id) => {
        try {
            await apiCall(`/testimonials/${id}`, 'DELETE');
            setTestimonials(testimonials.filter(t => t._id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [testimonials]);

    // CONTACT FORM - Send directly to backend
    const addContactMessage = useCallback(async (message) => {
        try {
            const result = await apiCall('/contact', 'POST', message, false);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteContactMessage = useCallback(async (id) => {
        try {
            await apiCall(`/contact/${id}`, 'DELETE');
            setContactMessages(contactMessages.filter(m => m._id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [contactMessages]);

    const value = {
        // Services
        services,
        addService,
        updateService,
        deleteService,

        // Blogs
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        getBlogById,

        // Testimonials
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        // Contact
        contactMessages,
        addContactMessage,
        deleteContactMessage,
        fetchContactMessages,
        getAnalyticsReport,
        getNotificationSettings,
        updateNotificationSettings,
        sendTestNotificationEmail,
        getUnreadMessageCount,

        // General
        loading,
        setLoading,
        error,
        setError,
        fetchAllData,  // Expose for manual refresh
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
