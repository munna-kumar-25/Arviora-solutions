#!/usr/bin/env node

/**
 * Add Sample Blogs to Database
 */

const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alfamukti:alfamukti%40123@arviora.syoer4b.mongodb.net/arviora?retryWrites=true&w=majority';

const sampleBlogs = [
    {
        title: 'Getting Started with React: A Beginner\'s Guide',
        description: 'Learn the fundamentals of React including components, JSX, and hooks. This comprehensive guide will help you start your React journey.',
        content: '<h2>Introduction to React</h2><p>React is a JavaScript library for building user interfaces with reusable components. It makes creating interactive UIs painless by allowing you to design simple views for each state in your application.</p><h3>Why React?</h3><ul><li>Component-based architecture</li><li>Virtual DOM for performance</li><li>Large ecosystem and community support</li><li>Easy to learn and use</li></ul><h3>Getting Started</h3><p>To get started with React, you need Node.js installed on your machine. Then, you can create a new React app using Create React App.</p><pre><code>npx create-react-app my-app\ncd my-app\nnpm start</code></pre>',
        category: 'web development',
        tags: ['react', 'javascript', 'web development', 'beginner'],
        author: 'Arviora Solution',
        isPublished: true,
        date: new Date('2024-01-15'),
    },
    {
        title: 'Mobile App Development with React Native',
        description: 'Explore how to build cross-platform mobile applications using React Native. Learn to share code between iOS and Android platforms.',
        content: '<h2>What is React Native?</h2><p>React Native is a framework for building Android and iOS applications using React and JavaScript. It allows developers to use React along with native platform capabilities.</p><h3>Key Benefits</h3><ul><li>Write once, run anywhere</li><li>Faster development cycles</li><li>Hot reloading for instant feedback</li><li>Access to native APIs</li></ul><h3>Getting Started with React Native</h3><p>Install React Native CLI and create your first project:</p><pre><code>npm install -g react-native-cli\nreact-native init MyApp\ncd MyApp\nnpm start</code></pre>',
        category: 'mobile development',
        tags: ['react native', 'mobile', 'cross-platform', 'javascript'],
        author: 'Arviora Solution',
        isPublished: true,
        date: new Date('2024-01-20'),
    },
    {
        title: 'Web Design Trends for 2024',
        description: 'Discover the latest web design trends including minimalism, dark mode, and interactive elements that are shaping modern web design.',
        content: '<h2>2024 Web Design Trends</h2><p>Web design is constantly evolving, and staying updated with the latest trends is crucial for creating modern and user-friendly websites.</p><h3>Top Trends</h3><ol><li><strong>Minimalism:</strong> Clean, simple designs with plenty of whitespace</li><li><strong>Dark Mode:</strong> Easy on the eyes, trendy, and energy-efficient</li><li><strong>Interactive Elements:</strong> Micro-interactions and animations</li><li><strong>Accessibility:</strong> Designing for all users</li><li><strong>AI Integration:</strong> Chatbots and personalization</li></ol><h3>Implementing These Trends</h3><p>Keep your design clean, focus on user experience, and ensure accessibility for all users. Test your designs thoroughly and gather user feedback.</p>',
        category: 'design',
        tags: ['design', 'ux', 'trends', '2024'],
        author: 'Arviora Solution',
        isPublished: true,
        date: new Date('2024-02-01'),
    },
    {
        title: 'Cloud DevOps: Best Practices for Scaling Applications',
        description: 'Learn essential DevOps practices for deploying and scaling applications in the cloud. Cover Docker, Kubernetes, and CI/CD pipelines.',
        content: '<h2>Cloud DevOps Fundamentals</h2><p>DevOps combines development and operations to shorten the development lifecycle and provide continuous delivery with high software quality.</p><h3>Key Technologies</h3><ul><li><strong>Docker:</strong> Containerization for consistent environments</li><li><strong>Kubernetes:</strong> Container orchestration and management</li><li><strong>CI/CD:</strong> Continuous Integration and Continuous Deployment</li><li><strong>Infrastructure as Code:</strong> Managing infrastructure through code</li></ul><h3>Best Practices</h3><p>Automate everything, monitor continuously, practice security at every layer, and foster collaboration between teams. Document your processes and keep them updated.</p>',
        category: 'cloud devops',
        tags: ['devops', 'cloud', 'docker', 'kubernetes'],
        author: 'Arviora Solution',
        isPublished: true,
        date: new Date('2024-02-10'),
    },
    {
        title: 'SEO Marketing: Boost Your Online Visibility',
        description: 'Comprehensive guide to SEO marketing strategies including keyword research, on-page optimization, and link building techniques.',
        content: '<h2>SEO Marketing Strategy</h2><p>Search Engine Optimization is the practice of optimizing your website to rank higher in search engine results, driving organic traffic.</p><h3>Core SEO Components</h3><ol><li><strong>Keyword Research:</strong> Find relevant keywords your audience is searching for</li><li><strong>On-Page SEO:</strong> Optimize title, meta descriptions, headers, and content</li><li><strong>Off-Page SEO:</strong> Build quality backlinks and establish authority</li><li><strong>Technical SEO:</strong> Ensure your website is properly structured and loads fast</li></ol><h3>SEO Tools</h3><p>Use tools like Google Analytics, SEMrush, Ahrefs, and Moz to track your progress and identify opportunities for improvement.</p>',
        category: 'seo marketing',
        tags: ['seo', 'marketing', 'content', 'optimization'],
        author: 'Arviora Solution',
        isPublished: true,
        date: new Date('2024-02-15'),
    },
];

async function addSampleBlogs() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check existing blogs
        const existingBlogs = await Blog.countDocuments();
        console.log(`Current blogs in database: ${existingBlogs}`);

        // Add sample blogs
        console.log('Adding sample blogs...');
        const result = await Blog.insertMany(sampleBlogs);
        console.log(`✅ Successfully added ${result.length} blogs`);

        // Show added blogs
        result.forEach(blog => {
            console.log(`  - ${blog.title} (${blog.category})`);
        });

        // Disconnect
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addSampleBlogs();
