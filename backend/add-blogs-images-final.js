#!/usr/bin/env node

const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

const sampleBlogs = [
    {
        title: 'Getting Started with React: A Beginner\'s Guide',
        description: 'Learn the fundamentals of React including components, JSX, and hooks.',
        content: '<h2>Introduction to React</h2><p>React is a JavaScript library for building user interfaces.</p>',
        category: 'web development',
        tags: ['react', 'javascript'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775905836131-91356980.jpg'
    },
    {
        title: 'Mobile App Development with React Native',
        description: 'Explore how to build cross-platform mobile applications.',
        content: '<h2>React Native</h2><p>Build iOS and Android apps with React.</p>',
        category: 'mobile development',
        tags: ['react native', 'mobile'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775905425888-601469035.png'
    },
    {
        title: 'Web Design Trends for 2024',
        description: 'Discover the latest web design trends.',
        content: '<h2>Latest Trends</h2><p>2024 design trends include minimalism and interactivity.</p>',
        category: 'design',
        tags: ['design', 'ux'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775905400148-226885347.jpg'
    },
    {
        title: 'Cloud DevOps: Best Practices',
        description: 'Learn DevOps practices for cloud deployment.',
        content: '<h2>DevOps Fundamentals</h2><p>Automate your deployment pipeline.</p>',
        category: 'cloud devops',
        tags: ['devops', 'cloud'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775904853921-341668875.jpg'
    },
    {
        title: 'SEO Marketing: Boost Your Visibility',
        description: 'SEO strategies for online visibility.',
        content: '<h2>SEO Strategy</h2><p>Optimize for search engines.</p>',
        category: 'seo marketing',
        tags: ['seo', 'marketing'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775913809665-253197648.jpg'
    },
];

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Clean database
        console.log('🗑️  Cleaning up...');
        await Blog.deleteMany({});
        try {
            await Blog.collection.dropIndexes();
        } catch (e) { }
        console.log('✅ Cleaned\n');

        // Add blogs
        console.log('📝 Adding blogs with images...\n');
        const result = await Blog.insertMany(sampleBlogs);

        result.forEach(blog => {
            console.log(`✅ ${blog.title}`);
            console.log(`   📸 Image: ${blog.image}\n`);
        });

        console.log(`✅ Added ${result.length} blogs!`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();
