#!/usr/bin/env node

/**
 * Delete and Re-add Sample Blogs with Description
 */

const http = require('http');

const sampleBlogs = [
    {
        title: 'Getting Started with React: A Beginner\'s Guide',
        description: 'Learn the fundamentals of React including components, JSX, and hooks. This comprehensive guide will help you start your React journey.',
        content: '<h2>Introduction to React</h2><p>React is a JavaScript library for building user interfaces with reusable components. It makes creating interactive UIs painless by allowing you to design simple views for each state in your application.</p><h3>Why React?</h3><ul><li>Component-based architecture</li><li>Virtual DOM for performance</li><li>Large ecosystem and community support</li><li>Easy to learn and use</li></ul><h3>Getting Started</h3><p>To get started with React, you need Node.js installed on your machine. Then, you can create a new React app using Create React App.</p>',
        category: 'web development',
        tags: ['react', 'javascript', 'web development', 'beginner'],
        author: 'Arviora Solution',
        isPublished: true,
    },
    {
        title: 'Mobile App Development with React Native',
        description: 'Explore how to build cross-platform mobile applications using React Native. Learn to share code between iOS and Android platforms.',
        content: '<h2>What is React Native?</h2><p>React Native is a framework for building Android and iOS applications using React and JavaScript. It allows developers to use React along with native platform capabilities.</p><h3>Key Benefits</h3><ul><li>Write once, run anywhere</li><li>Faster development cycles</li><li>Hot reloading for instant feedback</li><li>Access to native APIs</li></ul>',
        category: 'mobile development',
        tags: ['react native', 'mobile', 'cross-platform', 'javascript'],
        author: 'Arviora Solution',
        isPublished: true,
    },
    {
        title: 'Web Design Trends for 2024',
        description: 'Discover the latest web design trends including minimalism, dark mode, and interactive elements that are shaping modern web design.',
        content: '<h2>2024 Web Design Trends</h2><p>Web design is constantly evolving, and staying updated with the latest trends is crucial for creating modern and user-friendly websites.</p><h3>Top Trends</h3><ol><li><strong>Minimalism:</strong> Clean, simple designs with plenty of whitespace</li><li><strong>Dark Mode:</strong> Easy on the eyes, trendy, and energy-efficient</li><li><strong>Interactive Elements:</strong> Micro-interactions and animations</li><li><strong>Accessibility:</strong> Designing for all users</li></ol>',
        category: 'design',
        tags: ['design', 'ux', 'trends', '2024'],
        author: 'Arviora Solution',
        isPublished: true,
    },
    {
        title: 'Cloud DevOps: Best Practices for Scaling Applications',
        description: 'Learn essential DevOps practices for deploying and scaling applications in the cloud. Cover Docker, Kubernetes, and CI/CD pipelines.',
        content: '<h2>Cloud DevOps Fundamentals</h2><p>DevOps combines development and operations to shorten the development lifecycle and provide continuous delivery with high software quality.</p><h3>Key Technologies</h3><ul><li><strong>Docker:</strong> Containerization for consistent environments</li><li><strong>Kubernetes:</strong> Container orchestration and management</li><li><strong>CI/CD:</strong> Continuous Integration and Continuous Deployment</li></ul>',
        category: 'cloud devops',
        tags: ['devops', 'cloud', 'docker', 'kubernetes'],
        author: 'Arviora Solution',
        isPublished: true,
    },
    {
        title: 'SEO Marketing: Boost Your Online Visibility',
        description: 'Comprehensive guide to SEO marketing strategies including keyword research, on-page optimization, and link building techniques.',
        content: '<h2>SEO Marketing Strategy</h2><p>Search Engine Optimization is the practice of optimizing your website to rank higher in search engine results, driving organic traffic.</p><h3>Core SEO Components</h3><ol><li><strong>Keyword Research:</strong> Find relevant keywords your audience is searching for</li><li><strong>On-Page SEO:</strong> Optimize title, meta descriptions, headers, and content</li><li><strong>Off-Page SEO:</strong> Build quality backlinks and establish authority</li></ol>',
        category: 'seo marketing',
        tags: ['seo', 'marketing', 'content', 'optimization'],
        author: 'Arviora Solution',
        isPublished: true,
    },
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
        console.log('✅ Logged in');

        // Fetch existing blogs to delete them
        console.log('\n🗑️  Deleting existing blogs...');
        const blogsRes = await makeRequest('GET', '/blogs?limit=1000', null, token);

        if (blogsRes.data.blogs && blogsRes.data.blogs.length > 0) {
            for (const blog of blogsRes.data.blogs) {
                await makeRequest('DELETE', `/blogs/${blog._id}`, null, token);
                console.log(`  ✅ Deleted: ${blog.title}`);
                await new Promise(r => setTimeout(r, 300));
            }
        }

        // Add fresh blogs
        console.log('\n📝 Adding fresh blogs with descriptions...');
        for (const blog of sampleBlogs) {
            const result = await makeRequest('POST', '/blogs', blog, token);
            if (result.data.success || result.data.blog) {
                console.log(`  ✅ Added: ${blog.title}`);
            } else {
                console.log(`  ⚠️ ${blog.title}:`, result.data.message);
            }
            await new Promise(r => setTimeout(r, 500));
        }

        console.log('\n✅ Complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
