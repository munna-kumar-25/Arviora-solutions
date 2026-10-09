require('dotenv').config();
const express = require('express');
const cors = require('cors');
const asyncHandler = require('express-async-errors');
const connectDB = require('./config/db');
const { testEmailConnection } = require('./utils/emailService');

// Connect to MongoDB
connectDB();

// Test Email Connection
testEmailConnection();

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// ==================== MIDDLEWARE ====================

// CORS Configuration - Allow React frontend
app.use(
    cors({
        origin: function (origin, callback) {
            const configuredOrigins = (process.env.FRONTEND_URL || '')
                .split(',')
                .map((value) => value.trim().replace(/\/+$/, ''))
                .filter(Boolean);
            const productionOrigins = [
                'https://arviora-solutions-hamb.vercel.app/',
            ];
            const developmentOrigins = process.env.NODE_ENV === 'production' ? [] : [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3006',
                'http://10.118.184.24:3000',
                'http://10.118.184.24:3001',
                'http://10.118.184.24:3006',
                'http://127.0.0.1:3000',
                'http://127.0.0.1:3001',
                'http://127.0.0.1:3006'
            ];
            const allowedOrigins = new Set([...configuredOrigins, ...productionOrigins, ...developmentOrigins]);

            if (!origin || allowedOrigins.has(origin.replace(/\/+$/, ''))) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked request from origin: ${origin}`);
                callback(null, false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200
    })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files (images, documents, etc.)
app.use('/uploads', express.static('uploads'));

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
    });
});

// Global Error Handler (must be last)
app.use(errorHandler);

// ==================== SERVER STARTUP ====================

let PORT = parseInt(process.env.PORT || 5000, 10);
let server;

function startServer(port) {
    server = app.listen(port, () => {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`✅ Arviora Solutions Backend Server Running`);
        console.log(`📝 Server: http://localhost:${port}`);
        console.log(`🔗 API Base: http://localhost:${port}/api`);
        console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        console.log(`🗄️  Database: ${process.env.MONGO_URI ? 'Connected' : 'Not Connected'}`);
        console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`${'='.repeat(50)}\n`);
    });

    // Handle port already in use error
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            if (port < 5010) {
                console.warn(`⚠️  Port ${port} is already in use. Trying port ${port + 1}...`);
                server.close();
                startServer(port + 1);
            } else {
                console.error(`❌ All ports from 5000 to 5010 are in use. Please free up a port.`);
                process.exit(1);
            }
        } else {
            console.error('❌ Server Error:', err);
            process.exit(1);
        }
    });
}

startServer(PORT);

// ==================== GRACEFUL SHUTDOWN ====================

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
    console.log('⚠️  SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;
