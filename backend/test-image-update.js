#!/usr/bin/env node

/**
 * Direct Test - Update Blog Image via JSON
 */

const http = require('http');

function makeRequest(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : '';
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                ...(body ? { 'Content-Type': 'application/json' } : {}),
                ...(bodyStr ? { 'Content-Length': bodyStr.length } : {}),
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    console.log('Parse error:', e.message);
                    console.log('Data:', data.substring(0, 100));
                    resolve({ error: true, raw: data });
                }
            });
        });

        req.on('error', reject);
        if (bodyStr) {
            req.write(bodyStr);
        }
        req.end();
    });
}

async function main() {
    try {
        // Login
        const loginRes = await makeRequest('POST', '/auth/login', {
            email: 'arviorasolution@gmail.com',
            password: 'Arviora@29'
        });

        console.log('Login response:', loginRes);
        const token = loginRes.token;

        // Get first blog
        const blogsRes = await makeRequest('GET', '/blogs?limit=1', null, token);
        console.log('Blogs response:', JSON.stringify(blogsRes, null, 2).substring(0, 200));

        if (!blogsRes.blogs || blogsRes.blogs.length === 0) {
            console.log('No blogs found');
            process.exit(0);
        }

        const blog = blogsRes.blogs[0];
        console.log('\n📝 Original Blog:');
        console.log('Title:', blog.title);
        console.log('Image:', blog.image);

        // Update with image
        const updateRes = await makeRequest('PUT', `/blogs/${blog._id}`, {
            title: blog.title,
            description: blog.description,
            content: blog.content,
            category: blog.category,
            tags: blog.tags,
            author: blog.author,
            isPublished: blog.isPublished,
            image: 'image-1775904853921-341668875.jpg'
        }, token);

        console.log('\n📋 Update Response:');
        console.log('Success:', updateRes.success);
        if (updateRes.blog) {
            console.log('Updated Image:', updateRes.blog.image);
        } else {
            console.log('Error:', updateRes.message);
        }

    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

main();
