#!/usr/bin/env node

/**
 * Add Blogs with Images to MongoDB
 */

const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const sampleBlogs = [
    {
        title: 'Getting Started with React: A Beginner\'s Guide',
        description: 'Learn the fundamentals of React including components, JSX, and hooks. This comprehensive guide will help you start your React journey.',
        content: '<h2>Introduction to React</h2><p>React is a JavaScript library for building user interfaces with reusable components...</p>',
        category: 'web development',
        tags: ['react', 'javascript', 'web development', 'beginner'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775905836131-91356980.jpg'
    },
    {
        title: 'Mobile App Development with React Native',
        description: 'Explore how to build cross-platform mobile applications using React Native. Learn to share code between iOS and Android platforms.',
        content: '<h2>What is React Native?</h2><p>React Native is a framework for building Android and iOS applications...</p>',
        category: 'mobile development',
        tags: ['react native', 'mobile', 'cross-platform', 'javascript'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775905425888-601469035.png'
    },
    {
        title: 'Web Design Trends for 2024',
        description: 'Discover the latest web design trends including minimalism, dark mode, and interactive elements that are shaping modern web design.',
        content: '<h2>2024 Web Design Trends</h2><p>Web design is constantly evolving...</p>',
        category: 'design',
        tags: ['design', 'ux', 'trends', '2024'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775905400148-226885347.jpg'
    },
    {
        title: 'Cloud DevOps: Best Practices for Scaling Applications',
        description: 'Learn essential DevOps practices for deploying and scaling applications in the cloud. Cover Docker, Kubernetes, and CI/CD pipelines.',
        content: '<h2>Cloud DevOps Fundamentals</h2><p>DevOps combines development and operations...</p>',
        category: 'cloud devops',
        tags: ['devops', 'cloud', 'docker', 'kubernetes'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775904853921-341668875.jpg'
    },
    {
        title: 'SEO Marketing: Boost Your Online Visibility',
        description: 'Comprehensive guide to SEO marketing strategies including keyword research, on-page optimization, and link building techniques.',
        content: '<h2>SEO Marketing Strategy</h2><p>Search Engine Optimization is the practice...</p>',
        category: 'seo marketing',
        tags: ['seo', 'marketing', 'content', 'optimization'],
        author: 'Arviora Solution',
        isPublished: true,
        image: 'image-1775913809665-253197648.jpg'
    },
];

async function addBlogsWithImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Delete ALL existing blogs (including duplicates)
        console.log('🗑️  Cleaning up database...');
        await Blog.deleteMany({});
        // Drop the indexes to reset unique constraints
        try {
            await Blog.collection.dropIndexes();
        } catch (e) {
            // Index might not exist
        }
        console.log('✅ Database cleaned\n');

        // Add new blogs with images
        console.log('📝 Adding blogs with images...\n');
        const result = await Blog.insertMany(sampleBlogs);

        result.forEach(blog => {
            console.log(`✅ ${blog.title}`);
            console.log(`   📸 Image: ${blog.image}\n`);
        });

        console.log(`✅ Added ${result.length} blogs successfully!`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

console.log(`✅ Added ${result.length} blogs successfully!`);
await mongoose.disconnect();
process.exit(0);
    } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
}

addBlogsWithImages();
