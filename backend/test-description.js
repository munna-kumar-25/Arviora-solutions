#!/usr/bin/env node

const http = require('http');

async function test() {
    // Login
    const loginData = JSON.stringify({
        email: 'arviorasolution@gmail.com',
        password: 'Arviora@29'
    });

    const loginRes = await new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.write(loginData);
        req.end();
    });

    const token = loginRes.token;
    console.log('✅ Logged in');

    // Create blog with description
    const blogData = JSON.stringify({
        title: 'Test Blog with Description',
        description: 'This is a proper description for the blog',
        content: '<h2>Blog Content</h2><p>This is the main content</p>',
        category: 'web development',
        tags: ['test'],
        isPublished: true
    });

    const blogRes = await new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/blogs',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Length': blogData.length
            }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.write(blogData);
        req.end();
    });

    console.log('\nFull Response:', JSON.stringify(blogRes, null, 2));
    console.log('\nBlog Created:');
    if (blogRes.blog) {
        console.log('Title:', blogRes.blog.title);
        console.log('Description:', blogRes.blog.description);
        console.log('Category:', blogRes.blog.category);
        console.log('Date:', blogRes.blog.date);
    } else {
        console.log('Error:', blogRes.message);
    }

    process.exit(0);
}

test().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
