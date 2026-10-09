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
        console.log('\n📸 Blog Image Info:\n');
        console.log(`Title: ${blog.title}`);
        console.log(`Image Field Value: ${JSON.stringify(blog.image)}`);
        console.log(`Image Type: ${typeof blog.image}`);
        console.log(`Image is null: ${blog.image === null}`);
        console.log(`Image is empty: ${blog.image === ''}`);
        console.log(`Image is undefined: ${blog.image === undefined}`);
        console.log('\nIf image is null/empty, placeholder should show.');
        console.log('Expected URL: https://via.placeholder.com/300?text=No+Image');
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();
