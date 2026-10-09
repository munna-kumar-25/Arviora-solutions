#!/usr/bin/env node

/**
 * Assign Images to Blogs (Using FormData)
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

function makeRequest(method, path, body, token, isFormData = false) {
    return new Promise((resolve, reject) => {
        const isFile = isFormData && body instanceof FormData;

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                ...(isFile ? body.getHeaders() : { 'Content-Type': 'application/json' }),
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
        };

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
        if (isFile) {
            body.pipe(req);
        } else if (body) {
            req.write(JSON.stringify(body));
            req.end();
        } else {
            req.end();
        }
    });
}

async function main() {
    try {
        console.log('🔐 Authenticating...');
        const loginRes = await makeRequest('POST', '/auth/login', {
            email: 'arviorasolution@gmail.com',
            password: 'Arviora@29'
        }, null);

        if (!loginRes.data.token) {
            throw new Error('Login failed');
        }

        const token = loginRes.data.token;
        console.log('✅ Logged in\n');

        // Fetch all blogs
        console.log('📝 Fetching blogs...');
        const blogsRes = await makeRequest('GET', '/blogs?limit=1000', null, token);
        const blogs = blogsRes.data.blogs;
        console.log(`✅ Found ${blogs.length} blogs\n`);

        // Get image files
        const uploadsDir = path.join(__dirname, 'uploads');
        const imageFiles = fs.readdirSync(uploadsDir).filter(f =>
            ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(path.extname(f).toLowerCase())
        );

        console.log(`🖼️  Assigning images to blogs...\n`);

        for (let i = 0; i < blogs.length; i++) {
            const blog = blogs[i];
            const imageFile = imageFiles[i % imageFiles.length];
            const imagePath = path.join(uploadsDir, imageFile);

            // Create FormData
            const form = new FormData();
            form.append('title', blog.title);
            form.append('description', blog.description);
            form.append('content', blog.content);
            form.append('category', blog.category);
            form.append('tags', JSON.stringify(blog.tags));
            form.append('author', blog.author);
            form.append('isPublished', blog.isPublished);
            form.append('image', fs.createReadStream(imagePath));

            const updateRes = await makeRequest('PUT', `/blogs/${blog._id}`, form, token, true);

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
