import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AppContext = createContext();

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || (
    process.env.NODE_ENV === 'production'
        ? 'https://arviora-solutions-2.onrender.com/api'
        : 'http://localhost:5000/api'
);

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
            const response = await apiCall('/contact');
            setContactMessages(response.contacts || []);  // Backend returns 'contacts'
        } catch (err) {
            setError(err.message);
            console.error('Error fetching contact messages:', err);
        }
    }, []);

    // SERVICE OPERATIONS - All sync with backend API
    const addService = useCallback(async (serviceData) => {
        try {
            const formData = new FormData();

            // Add all fields except imagePreview
            Object.keys(serviceData).forEach(key => {
                if (key === 'imagePreview') {
                    // Skip preview, only send actual file
                    return;
                }

                if (key === 'features' || key === 'benefits') {
                    // Convert comma-separated strings to arrays
                    const array = serviceData[key]
                        ? serviceData[key].split(',').map(item => item.trim())
                        : [];
                    formData.append(key, JSON.stringify(array));
                } else if (serviceData[key] !== null && serviceData[key] !== undefined) {
                    formData.append(key, serviceData[key]);
                }
            });

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
                if (key === 'imagePreview') {
                    // Skip preview, only send actual file
                    return;
                }

                if (key === 'features' || key === 'benefits') {
                    // Convert comma-separated strings to arrays or keep if already array
                    let array = [];
                    if (typeof updatedData[key] === 'string') {
                        array = updatedData[key].split(',').map(item => item.trim());
                    } else if (Array.isArray(updatedData[key])) {
                        array = updatedData[key];
                    }
                    formData.append(key, JSON.stringify(array));
                } else if (updatedData[key] !== null && updatedData[key] !== undefined) {
                    formData.append(key, updatedData[key]);
                }
            });

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
        return blogs.find(b => b._id === id || b.id === parseInt(id) || b.slug === id);
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

        // General
        loading,
        setLoading,
        error,
        setError,
        fetchAllData,  // Expose for manual refresh
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
