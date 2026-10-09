require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n📋 MongoDB Connection Tester\n');

// Test different connection options
const connectionOptions = [
    {
        name: 'Current .env',
        uri: process.env.MONGO_URI,
        color: '\x1b[36m'
    },
    {
        name: 'Local MongoDB (Default)',
        uri: 'mongodb://localhost:27017/arviora',
        color: '\x1b[33m'
    }
];

async function testUri(option) {
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            resolve({ success: false, message: 'Connection timeout', option });
        }, 8000);

        mongoose.connect(option.uri, {
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000
        })
            .then(async (conn) => {
                clearTimeout(timeout);
                const dbName = conn.connection.db.name;
                await mongoose.disconnect();
                resolve({
                    success: true,
                    message: `Connected to DB: ${dbName}`,
                    option
                });
            })
            .catch((error) => {
                clearTimeout(timeout);
                resolve({
                    success: false,
                    message: error.message.split('\n')[0],
                    option
                });
            });
    });
}

async function runTests() {
    console.log('Testing connection options...\n');

    for (const option of connectionOptions) {
        const result = await testUri(option);
        if (result.success) {
            console.log(`${option.color}✅ ${result.option.name}`);
            console.log(`   → ${result.message}\x1b[0m\n`);
        } else {
            console.log(`\x1b[31m❌ ${result.option.name}`);
            console.log(`   → ${result.message}\x1b[0m\n`);
        }
    }

    console.log('\n📌 To fix authentication:\n');
    console.log('1️⃣  Update MONGO_URI in .env with correct Atlas credentials');
    console.log('2️⃣  OR use local MongoDB by changing MONGO_URI to:');
    console.log('   MONGO_URI=mongodb://localhost:27017/arviora\n');
    console.log('3️⃣  Run "npm start" after updating\n');

    process.exit(0);
}

runTests();
