const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Removed deprecated options: useNewUrlParser, useUnifiedTopology
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority',
            // Added to handle warnings appropriately
            autoCreate: true,
            autoIndex: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB Disconnected');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`❌ MongoDB Error: ${err.message}`);
        });

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Don't exit immediately, try to reconnect
        setTimeout(() => {
            console.log('🔄 Retrying database connection...');
            connectDB();
        }, 5000);
    }
};

module.exports = connectDB;
