require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Connection Diagnostic Tool\n');
console.log('='.repeat(50));

// Check if MONGO_URI is set
if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set in .env file');
    process.exit(1);
}

console.log('✅ MONGO_URI is configured\n');

// Try to connect
const testConnection = async () => {
    try {
        console.log('⏳ Attempting to connect to MongoDB...\n');

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority',
            autoCreate: true,
            autoIndex: true,
        });

        console.log('✅ CONNECTION SUCCESSFUL!\n');
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Port: ${conn.connection.port}`);
        console.log(`Database: ${conn.connection.name}`);
        console.log(`State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}\n`);

        // Try to list databases
        const adminDb = conn.connection.db.admin();
        const databases = await adminDb.listDatabases();
        console.log(`Available Databases: ${databases.databases.length}`);
        databases.databases.slice(0, 5).forEach(db => {
            console.log(`  - ${db.name}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Disconnected cleanly');
        process.exit(0);

    } catch (error) {
        console.error('❌ CONNECTION FAILED!\n');
        console.error(`Error: ${error.message}\n`);

        // Provide solutions based on error type
        if (error.message.includes('ENOTFOUND')) {
            console.log('💡 Solution: DNS resolution failed - check your internet connection');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 Solution: MongoDB Atlas cluster may be down or unreachable');
        } else if (error.message.includes('authentication failed')) {
            console.log('💡 Solution: Invalid credentials - check username/password in MONGO_URI');
        } else if (error.message.includes('IP address')) {
            console.log('💡 Solution: Your IP is not whitelisted in MongoDB Atlas');
            console.log('   Go to MongoDB Atlas → Network Access → Add your IP');
        } else if (error.message.includes('MongoServerSelectionError')) {
            console.log('💡 Solution: Cannot reach MongoDB Atlas - possible causes:');
            console.log('   1. Check internet connection');
            console.log('   2. Verify MongoDB Atlas cluster status (not paused)');
            console.log('   3. Check Network Access whitelist');
            console.log('   4. Verify credentials are correct');
        }

        console.log('\n📝 Current MONGO_URI (partial):');
        const uriParts = process.env.MONGO_URI.match(/mongodb\+srv:\/\/(.+?):.+?@(.+?)\?/);
        if (uriParts) {
            console.log(`   User: ${uriParts[1]}`);
            console.log(`   Host: ${uriParts[2]}`);
        }

        process.exit(1);
    }
};

testConnection();
