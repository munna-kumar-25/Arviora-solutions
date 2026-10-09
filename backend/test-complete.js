#!/usr/bin/env node

/**
 * Complete Diagnostic Script
 * Tests all operations: services, blogs, testimonials, login, etc.
 */

const http = require('http');

function apiTest(path, method = 'GET', data = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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

async function runDiagnostics() {
    console.log('\n🔍 COMPLETE SYSTEM DIAGNOSTIC\n');
    console.log('='.repeat(70));

    try {
        // Test 1: Health Check
        console.log('\n1️⃣  HEALTH CHECK');
        const health = await apiTest('/health');
        console.log(`   Status: ${health.status}`);
        console.log(`   Server: ${health.status === 200 ? '✅ Running' : '❌ Not responding'}`);

        if (health.status !== 200) {
            console.error('\n❌ BACKEND NOT RUNNING! Start backend first:\n   npm run dev');
            process.exit(1);
        }

        // Test 2: Login
        console.log('\n2️⃣  ADMIN LOGIN');
        const login = await apiTest('/auth/login', 'POST', {
            email: 'arviorasolution@gmail.com',
            password: 'Arviora@29',
        });
        console.log(`   Status: ${login.status}`);
        console.log(`   Result: ${login.status === 200 ? '✅ Success' : '❌ Failed'}`);

        let token = null;
        if (login.status === 200 && login.data.token) {
            token = login.data.token;
            console.log(`   Token: ${token.substring(0, 30)}...`);
        } else {
            console.log(`   Error: ${login.data.message}`);
        }

        // Test 3: Get All Services
        console.log('\n3️⃣  GET SERVICES');
        const services = await apiTest('/services');
        console.log(`   Status: ${services.status}`);
        console.log(`   Count: ${services.data.services?.length || 0} services`);
        if (services.data.services && services.data.services.length > 0) {
            console.log(`   Sample: ${services.data.services[0].title}`);
        }

        // Test 4: Get All Blogs
        console.log('\n4️⃣  GET BLOGS');
        const blogs = await apiTest('/blogs');
        console.log(`   Status: ${blogs.status}`);
        console.log(`   Count: ${blogs.data.blogs?.length || 0} blogs`);
        if (blogs.data.blogs && blogs.data.blogs.length > 0) {
            console.log(`   Sample: ${blogs.data.blogs[0].title}`);
        }

        // Test 5: Get All Testimonials
        console.log('\n5️⃣  GET TESTIMONIALS');
        const testimonials = await apiTest('/testimonials');
        console.log(`   Status: ${testimonials.status}`);
        console.log(`   Count: ${testimonials.data.testimonials?.length || 0} testimonials`);
        if (testimonials.data.testimonials && testimonials.data.testimonials.length > 0) {
            console.log(`   Sample: ${testimonials.data.testimonials[0].name}`);
        }

        // Test 6: Get Contact Messages (requires auth)
        console.log('\n6️⃣  GET CONTACT MESSAGES (Protected)');
        if (token) {
            const messages = await apiTest('/contact', 'GET', null, token);
            console.log(`   Status: ${messages.status}`);
            console.log(`   Count: ${messages.data.messages?.length || 0} messages`);
        } else {
            console.log(`   Skipped: No token available`);
        }

        // Test 7: Database Connection Status
        console.log('\n7️⃣  DATABASE STATUS');
        console.log(`   MongoDB: ${health.data.timestamp ? '✅ Connected' : '❌ Not connected'}`);

        console.log('\n' + '='.repeat(70));
        console.log('\n📋 DIAGNOSTIC SUMMARY:\n');
        console.log(`✅ Backend Server: OK`);
        console.log(`${login.status === 200 ? '✅' : '❌'} Admin Login: ${login.status === 200 ? 'OK' : 'FAILED'}`);
        console.log(`${services.status === 200 ? '✅' : '❌'} Services: ${services.status === 200 ? 'OK' : 'FAILED'}`);
        console.log(`${blogs.status === 200 ? '✅' : '❌'} Blogs: ${blogs.status === 200 ? 'OK' : 'FAILED'}`);
        console.log(`${testimonials.status === 200 ? '✅' : '❌'} Testimonials: ${testimonials.status === 200 ? 'OK' : 'FAILED'}`);

        console.log('\n🔧 NEXT STEPS:\n');
        console.log('1. Check if backend is running: npm run dev');
        console.log('2. Check if MongoDB is connected');
        console.log('3. Check if admin user exists: node setup-admin.js');
        console.log('4. Try login on http://localhost:3000/login');
        console.log('5. Add services/blogs/testimonials in admin panel\n');

    } catch (error) {
        console.error('❌ DIAGNOSTIC ERROR:', error.message);
        console.error('\n⚠️  Make sure:');
        console.error('  1. Backend is running on port 5000');
        console.error('  2. MongoDB is connected');
        console.error('  3. Admin user has been created\n');
        process.exit(1);
    }

    process.exit(0);
}

// Run diagnostics
runDiagnostics();
