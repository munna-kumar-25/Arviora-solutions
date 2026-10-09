#!/usr/bin/env node

/**
 * MongoDB Connection Diagnostic
 */

const mongoose = require('mongoose');
require('dotenv').config();

console.log('\n🔍 MongoDB Connection Diagnostic\n');
console.log('Configuration:');
console.log(`  MONGO_URI: ${process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 50) + '...' : 'NOT SET'}`);
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

async function testConnection() {
    try {
        console.log('\n⏳ Attempting to connect...');

        // Set timeout for connection
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
        );

        const connectPromise = mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        await Promise.race([connectPromise, timeoutPromise]);

        console.log('✅ Successfully connected to MongoDB!');
        console.log(`  Database: ${mongoose.connection.name}`);
        console.log(`  Host: ${mongoose.connection.host}`);
        console.log(`  State: ${mongoose.connection.states[mongoose.connection.readyState]}`);

        // Test a simple query
        console.log('\n⏳ Testing database operations...');
        const Service = require('./models/Service');
        const count = await Service.countDocuments();
        console.log(`✅ Database query successful! Services count: ${count}`);

        await mongoose.connection.close();
        console.log('\n✅ Connection closed successfully\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection Error:', error.message);
        console.error('\nPossible causes:');
        console.error('  1. Invalid MongoDB URI in .env');
        console.error('  2. IP address not whitelisted in MongoDB Atlas');
        console.error('  3. Network connectivity issues');
        console.error('  4. Wrong database credentials');
        console.error('\nSolution:');
        console.error('  - Verify MONGO_URI in .env file');
        console.error('  - Check MongoDB Atlas network access (IP whitelist)');
        console.error('  - Ensure internet connection is working\n');
        process.exit(1);
    }
}

testConnection();
