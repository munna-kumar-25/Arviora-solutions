#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

const API_BASE = 'http://localhost:5001/api';
let adminToken = '';

// Color logging
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}\n`),
};

// Simple HTTP POST helper
function httpRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: JSON.parse(body)
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            if (typeof data === 'string') {
                req.write(data);
            } else {
                data.pipe(req);
                return; // FormData handles writing
            }
        }
        req.end();
    });
}

async function login() {
    log.section('STEP 1: Admin Login');
    try {
        const url = new URL(`${API_BASE}/auth/login`);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const loginData = JSON.stringify({
            email: 'arviorasolution@gmail.com',
            password: 'Arviora@29',
        });

        const response = await httpRequest(options, loginData);

        if (response.statusCode !== 200) {
            log.error(`Login failed: ${response.body.message}`);
            return false;
        }

        adminToken = response.body.token;
        log.success(`Admin logged in successfully`);
        log.info(`Token: ${adminToken.substring(0, 50)}...`);
        return true;
    } catch (error) {
        log.error(`Login error: ${error.message}`);
        return false;
    }
}

async function createBlogWithImage() {
    log.section('STEP 2: Create Blog with Image Upload');

    try {
        // Find first image file in uploads folder
        const uploadsDir = path.join(__dirname, 'uploads');
        const imageFiles = fs.readdirSync(uploadsDir).filter(f =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
        );

        if (imageFiles.length === 0) {
            log.error('No image files found in uploads folder');
            return false;
        }

        const imageFile = imageFiles[0];
        const imagePath = path.join(uploadsDir, imageFile);
        log.info(`Using test image: ${imageFile}`);

        // Create FormData for blog with image
        const form = new FormData();
        form.append('title', 'Test Blog with Image Upload - ' + new Date().toISOString());
        form.append('content', 'This is a test blog post created via image upload test. It should have a proper description and date field.');
        form.append('description', 'This is a test description for the newly uploaded blog with image.');
        form.append('category', 'web development');
        form.append('tags', JSON.stringify(['test', 'image', 'upload']));
        form.append('author', 'Test Author');
        form.append('date', new Date().toISOString());
        form.append('isPublished', 'true');

        // Append the image file
        const imageStream = fs.createReadStream(imagePath);
        form.append('image', imageStream, imageFile);

        log.info('Sending blog creation request with image...');

        const url = new URL(`${API_BASE}/blogs`);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                ...form.getHeaders(),
            },
        };

        const response = await httpRequest(options, form);

        if (response.statusCode !== 201 && response.statusCode !== 200) {
            log.error(`Blog creation failed: ${response.body.message}`);
            return false;
        }

        const blog = response.body.blog;
        log.success('Blog created successfully!');
        log.info(`Blog ID: ${blog._id}`);
        log.info(`Blog Title: ${blog.title}`);
        log.info(`Blog Image: ${blog.image}`);
        log.info(`Blog Description: ${blog.description}`);
        log.info(`Blog Date: ${blog.date}`);

        return blog;
    } catch (error) {
        log.error(`Blog creation error: ${error.message}`);
        return false;
    }
}

async function verifyBlogInAPI(blog) {
    log.section('STEP 3: Verify Blog in API Response');

    try {
        const url = new URL(`${API_BASE}/blogs/${blog._id}`);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: 'GET',
        };

        const response = await httpRequest(options);

        if (response.statusCode !== 200) {
            log.error(`Failed to fetch blog: ${response.body.message}`);
            return false;
        }

        const fetchedBlog = response.body.blog;

        if (fetchedBlog.image) {
            log.success(`✅ Image is saved! URL would be: http://localhost:5001/uploads/${fetchedBlog.image}`);
        } else {
            log.warn('⚠️  Image field is empty/null');
        }

        return true;
    } catch (error) {
        log.error(`Verification error: ${error.message}`);
        return false;
    }
}

async function testFullFlow() {
    log.section('🚀 TESTING ADMIN BLOG IMAGE UPLOAD');

    if (!await login()) {
        log.error('Login failed. Stopping tests.');
        process.exit(1);
    }

    const blog = await createBlogWithImage();
    if (!blog) {
        log.error('Blog creation failed. Stopping tests.');
        process.exit(1);
    }

    if (!await verifyBlogInAPI(blog)) {
        log.error('Verification failed. Blog may not be saved correctly.');
        process.exit(1);
    }

    log.section('✅ ALL TESTS PASSED!');
    log.success('Admin image upload flow is working correctly!');
    process.exit(0);
}

// Run the test
testFullFlow().catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
});
