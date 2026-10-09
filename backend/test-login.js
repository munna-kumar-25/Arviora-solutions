#!/usr/bin/env node

/**
 * Login Test Script
 * Tests the admin login endpoint
 */

const http = require('http');

function apiTest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({
                        status: res.statusCode,
                        data: json,
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: body,
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('\n🧪 Login Test - Arviora Solutions Backend\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Health Check
        console.log('\n✓ Test 1: Health Check');
        const health = await apiTest('/health');
        console.log(`  Status: ${health.status}`);
        console.log(`  Response: ${JSON.stringify(health.data)}`);

        if (health.status !== 200) {
            console.error('❌ Backend is not responding! Make sure backend is running on port 5000');
            process.exit(1);
        }

        // Test 2: Login with correct credentials
        console.log('\n✓ Test 2: Login with correct credentials');
        const loginCorrect = await apiTest('/auth/login', 'POST', {
            email: 'arviorasolution@gmail.com',
            password: 'Arviora@29',
        });
        console.log(`  Status: ${loginCorrect.status}`);
        console.log(`  Response: ${JSON.stringify(loginCorrect.data, null, 2)}`);

        if (loginCorrect.status === 200 && loginCorrect.data.token) {
            console.log('\n✅ Login successful! Token received.');
            console.log(`  Token: ${loginCorrect.data.token.substring(0, 20)}...`);
        } else {
            console.log('\n❌ Login failed!');
        }

        // Test 3: Login with wrong password
        console.log('\n✓ Test 3: Login with wrong password');
        const loginWrong = await apiTest('/auth/login', 'POST', {
            email: 'arviorasolution@gmail.com',
            password: 'WrongPassword',
        });
        console.log(`  Status: ${loginWrong.status}`);
        console.log(`  Response: ${JSON.stringify(loginWrong.data)}`);

        // Test 4: Login with non-existent email
        console.log('\n✓ Test 4: Login with non-existent email');
        const loginNotFound = await apiTest('/auth/login', 'POST', {
            email: 'nonexistent@example.com',
            password: 'SomePassword',
        });
        console.log(`  Status: ${loginNotFound.status}`);
        console.log(`  Response: ${JSON.stringify(loginNotFound.data)}`);

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ All login tests completed!\n');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
        console.error('\n⚠️  Make sure the backend is running:');
        console.error('  1. Open a terminal in the backend folder');
        console.error('  2. Run: npm run dev');
        process.exit(1);
    }

    process.exit(0);
}

// Run tests
runTests();
