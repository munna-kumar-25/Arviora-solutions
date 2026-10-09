import React, { createContext, useState, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const readStoredSession = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('adminUser');

    if (!token || !storedUser) {
        return { isLoggedIn: false, adminUser: null };
    }

    try {
        return { isLoggedIn: true, adminUser: JSON.parse(storedUser) };
    } catch (error) {
        console.error('Could not restore the saved admin session:', error);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('token');
        return { isLoggedIn: false, adminUser: null };
    }
};

// Health check function to verify backend is running
const checkBackendHealth = async () => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/health`, {
            method: 'GET',
            timeout: 5000,
        });
        return response.ok;
    } catch (err) {
        return false;
    }
};

// Retry function for failed requests
const retryFetch = async (url, options, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            }
            // If server responds but with error, return the response
            if (i === retries - 1) {
                return response;
            }
        } catch (err) {
            if (i === retries - 1) {
                throw err;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
        }
    }
};

export const AuthProvider = ({ children }) => {
    const [initialSession] = useState(readStoredSession);
    const [isLoggedIn, setIsLoggedIn] = useState(initialSession.isLoggedIn);
    const [adminUser, setAdminUser] = useState(initialSession.adminUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            // Check if backend is running
            const isBackendHealthy = await checkBackendHealth();
            if (!isBackendHealthy) {
                setError('Backend server is not running. Please start the server and try again.');
                setLoading(false);
                return false;
            }

            const response = await retryFetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
                setLoading(false);
                return false;
            }

            const userData = data.admin;

            setAdminUser(userData);
            setIsLoggedIn(true);

            // Store in localStorage for persistence (use 'token' for consistency with AppContext)
            localStorage.setItem('adminUser', JSON.stringify(userData));
            localStorage.setItem('token', data.token);

            setLoading(false);
            return true;
        } catch (err) {
            if (err.message === 'Failed to fetch') {
                setError('Cannot connect to server. Please check if backend is running on port 5000');
            } else {
                setError(err.message || 'Login error');
            }
            setLoading(false);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setAdminUser(null);
        setError(null);

        // Clear localStorage
        localStorage.removeItem('adminUser');
        localStorage.removeItem('token');
    }, []);

    // Check if user was previously logged in
    const checkAuth = useCallback(() => {
        const storedUser = localStorage.getItem('adminUser');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setAdminUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    // Update user profile
    const updateUserProfile = useCallback(async (updatedData) => {
        const { data } = await authAPI.updateProfile({ name: updatedData.name || '' });
        const updatedUser = { ...adminUser, ...data.admin, ...updatedData };
        setAdminUser(updatedUser);
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        return updatedUser;
    }, [adminUser]);

    const value = {
        isLoggedIn,
        adminUser,
        loading,
        error,
        setError,
        login,
        logout,
        checkAuth,
        updateUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
