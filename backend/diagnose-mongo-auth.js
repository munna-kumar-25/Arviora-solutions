require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Authentication Diagnostics\n');
console.log('Connection String (redacted):');
const uri = process.env.MONGO_URI;
const redactedUri = uri.replace(/:[^:@]+@/, ':****@');
console.log(redactedUri);

// Extract credentials from URI
const uriMatch = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
if (uriMatch) {
    const username = uriMatch[1];
    const password = uriMatch[2];
    console.log(`\n👤 Username: ${username}`);
    console.log(`🔐 Password length: ${password.length} characters`);
    console.log(`🔐 Password (first 5 chars): ${password.substring(0, 5)}...`);
}

async function testConnection() {
    try {
        console.log('\n🔄 Attempting MongoDB connection...');

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000,
            retryWrites: true,
            w: 'majority',
            autoCreate: true,
            autoIndex: true,
        });

        console.log(`\n✅ Connection Successful!`);
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.db.name}`);

        // List all databases (if admin)
        try {
            const adminDb = conn.connection.db.admin();
            const databases = await adminDb.listDatabases();
            console.log(`\n📦 Available Databases (${databases.databases.length}):`);
            databases.databases.slice(0, 10).forEach(db => {
                console.log(`  - ${db.name}`);
            });
        } catch (dbErr) {
            console.log(`\nℹ️  Could not list databases (may need admin privileges): ${dbErr.message}`);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.log(`\n❌ Connection Failed!`);
        console.log(`\nError Message: ${error.message}`);
        console.log(`Error Code: ${error.code}`);

        if (error.message.includes('authentication failed')) {
            console.log(`\n🔴 AUTHENTICATION ERROR DETECTED`);
            console.log(`\nPossible causes:`);
            console.log(`  1. Username/password in connection string is incorrect`);
            console.log(`  2. Database user was not created or was deleted`);
            console.log(`  3. User's IP is not whitelisted in MongoDB Atlas`);
            console.log(`  4. Special characters in password need URL encoding`);
            console.log(`\nSolutions:`);
            console.log(`  • Check MongoDB Atlas: Verify the credentials match exactly`);
            console.log(`  • Go to: https://cloud.mongodb.com/`);
            console.log(`  • Project → Database Access → Check user 'arviora-solution'`);
            console.log(`  • Project → Network Access → Check if 0.0.0.0/0 is whitelisted`);
        }

        process.exit(1);
    }
}

testConnection();
