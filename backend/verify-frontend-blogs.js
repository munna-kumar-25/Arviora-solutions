#!/usr/bin/env node

const http = require('http');

const API_BASE = 'http://localhost:5001/api';

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

// Simple HTTP GET helper
function httpGet(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
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
        req.end();
    });
}

async function verifyBlogsInFrontend() {
    log.section('🚀 VERIFYING BLOGS IN FRONTEND VIEW');

    try {
        log.info('Fetching published blogs (frontend view)...');
        const response = await httpGet(`${API_BASE}/blogs?page=1&limit=10&isPublished=true`);

        if (response.statusCode !== 200) {
            log.error(`Failed to fetch blogs: ${response.body.message}`);
            return false;
        }

        const { blogs, total } = response.body;

        log.success(`Found ${total} published blogs`);
        log.info(`Displaying first 10 blogs:`);

        blogs.forEach((blog, index) => {
            console.log(`\n${colors.cyan}Blog ${index + 1}:${colors.reset}`);
            console.log(`  Title: ${blog.title}`);
            console.log(`  Description: ${blog.description}`);
            console.log(`  Image: ${blog.image || 'NO IMAGE'}`);
            if (blog.image) {
                console.log(`  Image URL: http://localhost:5001/uploads/${blog.image}`);
            }
            console.log(`  Category: ${blog.category}`);
            console.log(`  Date: ${new Date(blog.date).toLocaleDateString()}`);
            console.log(`  Views: ${blog.views}`);
        });

        // Count blogs with images
        const blogsWithImages = blogs.filter(b => b.image);
        log.success(`${blogsWithImages.length}/${blogs.length} blogs have images`);

        if (blogsWithImages.length === 0) {
            log.warn('No blogs with images found!');
            return false;
        }

        return true;
    } catch (error) {
        log.error(`Error: ${error.message}`);
        return false;
    }
}

verifyBlogsInFrontend().then(success => {
    if (success) {
        log.section('✅ FRONTEND BLOG VERIFICATION PASSED!');
        log.success('Blogs with images are ready to display in frontend!');
        process.exit(0);
    } else {
        log.section('❌ FRONTEND BLOG VERIFICATION FAILED!');
        process.exit(1);
    }
}).catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
});
