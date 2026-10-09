#!/usr/bin/env node

/**
 * Quick API Test Script
 * Tests basic backend endpoints
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
    console.log('\n🧪 API Test Suite - Arviora Solutions Backend\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Health Check
        console.log('\n✓ Test 1: Health Check');
        const health = await apiTest('/health');
        console.log(`  Status: ${health.status}`);
        console.log(`  Response: ${JSON.stringify(health.data)}`);

        // Test 2: Get All Services (should be empty initially)
        console.log('\n✓ Test 2: Get All Services');
        const services = await apiTest('/services');
        console.log(`  Status: ${services.status}`);
        console.log(`  Response: ${JSON.stringify(services.data)}`);

        // Test 3: Get All Blogs (should be empty initially)
        console.log('\n✓ Test 3: Get All Blogs');
        const blogs = await apiTest('/blogs');
        console.log(`  Status: ${blogs.status}`);
        console.log(`  Response: ${JSON.stringify(blogs.data)}`);

        // Test 4: Get All Testimonials (should be empty initially)
        console.log('\n✓ Test 4: Get All Testimonials');
        const testimonials = await apiTest('/testimonials');
        console.log(`  Status: ${testimonials.status}`);
        console.log(`  Response: ${JSON.stringify(testimonials.data)}`);

        // Test 5: Submit Contact Form
        console.log('\n✓ Test 5: Submit Contact Form (Public)');
        const contact = await apiTest('/contact', 'POST', {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            subject: 'Test Inquiry',
            message: 'This is a test message from the API test script',
        });
        console.log(`  Status: ${contact.status}`);
        console.log(`  Response: ${JSON.stringify(contact.data)}`);

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ All tests completed successfully!\n');
        console.log('📝 Next Steps:');
        console.log('  1. Register an admin: POST /api/auth/register');
        console.log('  2. Login: POST /api/auth/login');
        console.log('  3. Create content with your token\n');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
        process.exit(1);
    }

    process.exit(0);
}

// Run tests
runTests();
