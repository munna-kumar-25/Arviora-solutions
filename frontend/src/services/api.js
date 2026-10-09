import axios from 'axios';

// Configure base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://arviora-solutions-2.onrender.com';

// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return 'https://via.placeholder.com/300?text=No+Image';
    }
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    // Otherwise, append to uploads directory
    return `${BACKEND_URL}/uploads/${imagePath}`;
};

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor (for future auth token handling)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor (for future error handling)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// SERVICES API
export const servicesAPI = {
    getAll: () => apiClient.get('/services'),
    getById: (id) => apiClient.get(`/services/${id}`),
    create: (data) => apiClient.post('/services', data),
    update: (id, data) => apiClient.put(`/services/${id}`, data),
    delete: (id) => apiClient.delete(`/services/${id}`),
};

// BLOGS API
export const blogsAPI = {
    getAll: () => apiClient.get('/blogs'),
    getById: (id) => apiClient.get(`/blogs/${id}`),
    getBySlug: (slug) => apiClient.get(`/blogs/slug/${slug}`),
    create: (data) => apiClient.post('/blogs', data),
    update: (id, data) => apiClient.put(`/blogs/${id}`, data),
    delete: (id) => apiClient.delete(`/blogs/${id}`),
    search: (query) => apiClient.get(`/blogs/search?q=${query}`),
};

// TESTIMONIALS API
export const testimonialsAPI = {
    getAll: () => apiClient.get('/testimonials'),
    getById: (id) => apiClient.get(`/testimonials/${id}`),
    create: (data) => apiClient.post('/testimonials', data),
    update: (id, data) => apiClient.put(`/testimonials/${id}`, data),
    delete: (id) => apiClient.delete(`/testimonials/${id}`),
};

// CONTACT API
export const contactAPI = {
    sendMessage: (data) => apiClient.post('/contact/send', data),
    getMessages: () => apiClient.get('/contact/messages'),
    deleteMessage: (id) => apiClient.delete(`/contact/messages/${id}`),
};

// AUTH API (for future admin authentication)
export const authAPI = {
    login: (email, password) => apiClient.post('/auth/login', { email, password }),
    logout: () => apiClient.post('/auth/logout'),
    register: (data) => apiClient.post('/auth/register', data),
    refreshToken: () => apiClient.post('/auth/refresh'),
};

// ANALYTICS API (for future tracking)
export const analyticsAPI = {
    trackPageView: (page) => apiClient.post('/analytics/page-view', { page }),
    trackEvent: (event, data) => apiClient.post('/analytics/event', { event, data }),
};

export default apiClient;
