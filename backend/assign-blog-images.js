#!/usr/bin/env node

/**
 * Assign Random Images to Blogs
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Get list of images from uploads folder
const uploadsDir = path.join(__dirname, 'uploads');
const imageFiles = fs.readdirSync(uploadsDir).filter(f =>
    ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(path.extname(f).toLowerCase())
);

console.log(`✅ Found ${imageFiles.length} images in uploads folder\n`);

const blogs = [
    { title: 'Getting Started with React: A Beginner\'s Guide', imageIndex: 0 },
    { title: 'Mobile App Development with React Native', imageIndex: 1 },
    { title: 'Web Design Trends for 2024', imageIndex: 2 },
    { title: 'Cloud DevOps: Best Practices for Scaling Applications', imageIndex: 3 },
    { title: 'SEO Marketing: Boost Your Online Visibility', imageIndex: 4 },
];

function makeRequest(method, path, body = null, token = null) {
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

        if (body) {
            const bodyStr = JSON.stringify(body);
            options.headers['Content-Length'] = bodyStr.length;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: response,
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                    });
                }
            });
        });

        req.on('error', reject);
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function main() {
    try {
        console.log('🔐 Authenticating...');
        const loginRes = await makeRequest('POST', '/auth/login', {
            email: 'arviorasolution@gmail.com',
            password: 'Arviora@29'
        });

        if (!loginRes.data.token) {
            throw new Error('Login failed');
        }

        const token = loginRes.data.token;
        console.log('✅ Logged in\n');

        // Fetch all blogs
        console.log('📝 Fetching blogs...');
        const blogsRes = await makeRequest('GET', '/blogs?limit=1000', null, token);
        console.log(`✅ Found ${blogsRes.data.blogs.length} blogs\n`);

        // Update each blog with an image
        console.log('🖼️  Assigning images to blogs...\n');
        for (let i = 0; i < blogsRes.data.blogs.length && i < blogs.length; i++) {
            const blog = blogsRes.data.blogs[i];
            const imageFile = imageFiles[i % imageFiles.length];

            const updateRes = await makeRequest('PUT', `/blogs/${blog._id}`, {
                title: blog.title,
                description: blog.description,
                content: blog.content,
                category: blog.category,
                tags: blog.tags,
                author: blog.author,
                image: imageFile,
                isPublished: blog.isPublished,
            }, token);

            if (updateRes.data.success || updateRes.data.blog) {
                console.log(`✅ ${blog.title}`);
                console.log(`   📸 Image: ${imageFile}\n`);
            } else {
                console.log(`⚠️ ${blog.title}:`, updateRes.data.message);
            }
        }

        console.log('✅ Complete! All blogs now have images.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
