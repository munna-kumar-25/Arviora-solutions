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
        const res = await apiCall('/blogs?limit=2');
        console.log('\n✅ Blogs with Images:\n');
        res.blogs.forEach((blog, i) => {
            console.log(`${i + 1}. ${blog.title}`);
            console.log(`   📸 Image: ${blog.image}`);
            console.log(`   Description: ${blog.description.substring(0, 50)}...`);
            console.log('');
        });
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();
