#!/usr/bin/env node

const http = require('http');

function apiCall(path) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: 'GET',
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    try {
        const res = await apiCall('/blogs?limit=1');
        const blog = res.blogs[0];

        console.log('\n========== BLOG IMAGE DEBUG ==========\n');
        console.log('Blog Title:', blog.title);
        console.log('Image Field:', blog.image);
        console.log('Image Type:', typeof blog.image);
        console.log('\nExpected URL from getImageUrl():');

        const BACKEND_URL = 'http://localhost:5000';

        if (!blog.image) {
            console.log('  Result: Placeholder (No image)');
            console.log('  URL: https://via.placeholder.com/300?text=No+Image');
        } else if (blog.image.startsWith('http')) {
            console.log('  Result: Full URL used as-is');
            console.log('  URL:', blog.image);
        } else {
            console.log('  Result: Constructed URL');
            const url = `${BACKEND_URL}/uploads/${blog.image}`;
            console.log('  URL:', url);

            // Test if URL works
            console.log('\nTesting URL accessibility...');
            const testReq = http.request(new URL(url), { method: 'HEAD' }, (res) => {
                if (res.statusCode === 200) {
                    console.log('  ✅ Image URL is ACCESSIBLE (200 OK)');
                } else {
                    console.log(`  ⚠️ Image URL returned ${res.statusCode}`);
                }
            });
            testReq.on('error', (err) => {
                console.log('  ❌ Image URL ERROR:', err.message);
            });
            testReq.end();
        }

        console.log('\n======================================\n');
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();
