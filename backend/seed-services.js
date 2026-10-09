require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

const services = [
    // Mobile App Development
    {
        title: 'Android & iOS App Development',
        description: 'Native mobile app development for both Android and iOS platforms with high performance and user experience.',
        category: 'mobile',
        features: ['Native Development', 'High Performance', 'User-Friendly Interface', 'Cross-platform Optimization'],
        benefits: ['Faster App Launch', 'Better Performance', 'Native Features Support', 'Seamless User Experience']
    },
    {
        title: 'Cross-platform Apps',
        description: 'Build once, deploy everywhere with cross-platform mobile application development.',
        category: 'mobile',
        features: ['Single Codebase', 'Multiple Platform Support', 'React Native/Flutter', 'Cost Effective'],
        benefits: ['Reduced Development Cost', 'Faster Time to Market', 'Easier Maintenance', 'Wider Audience Reach']
    },
    {
        title: 'Enterprise Applications',
        description: 'Scalable and secure enterprise-level mobile applications tailored to your business needs.',
        category: 'mobile',
        features: ['Enterprise Security', 'Scalability', 'Integration Ready', 'Advanced Analytics'],
        benefits: ['Increased Productivity', 'Enhanced Security', 'Seamless Integration', 'Real-time Insights']
    },
    {
        title: 'App UI/UX Design',
        description: 'Professional user interface and user experience design for your mobile applications.',
        category: 'mobile',
        features: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
        benefits: ['Improved User Satisfaction', 'Higher Engagement', 'Brand Consistency', 'Intuitive Navigation']
    },

    // Web Development Solutions
    {
        title: 'Custom Website Development',
        description: 'Bespoke website development tailored to your unique business requirements and brand identity.',
        category: 'web',
        features: ['Responsive Design', 'SEO Optimized', 'Performance Focused', 'Security Hardened'],
        benefits: ['Increased Conversions', 'Better Visibility', 'Fast Loading Speed', 'Enhanced Security']
    },
    {
        title: 'UI/UX Design',
        description: 'Creative and user-focused design solutions for web and mobile applications.',
        category: 'web',
        features: ['User Research', 'Prototyping', 'Visual Design', 'Usability Testing'],
        benefits: ['Better User Engagement', 'Improved Brand Image', 'Higher Conversion', 'User Satisfaction']
    },
    {
        title: 'E-commerce Development',
        description: 'Powerful e-commerce solutions with payment gateways, inventory management, and analytics.',
        category: 'web',
        features: ['Payment Integration', 'Shopping Cart', 'Inventory Management', 'Analytics Dashboard'],
        benefits: ['Increased Sales', 'Better Customer Experience', 'Easy Management', 'Growth Ready']
    },
    {
        title: 'CMS-Based Websites',
        description: 'Content management system websites for easy content updates and management.',
        category: 'web',
        features: ['Easy Content Management', 'User-friendly Dashboard', 'Security Features', 'SEO Integration'],
        benefits: ['Easy Updates', 'No Technical Knowledge Required', 'Cost Effective', 'Scalable']
    },
    {
        title: 'Web Application Development',
        description: 'Full-featured web applications with modern technologies and best practices.',
        category: 'web',
        features: ['Modern Stack', 'Real-time Updates', 'Cloud Ready', 'Progressive Web App'],
        benefits: ['Offline Functionality', 'Fast Performance', 'Mobile Compatible', 'Easy Deployment']
    },

    // Digital Marketing Services
    {
        title: 'Search Engine Optimization (SEO)',
        description: 'Comprehensive SEO strategies to improve your online visibility and organic search rankings.',
        category: 'marketing',
        features: ['Keyword Research', 'On-page Optimization', 'Link Building', 'Technical SEO'],
        benefits: ['Higher Rankings', 'Increased Traffic', 'Sustainable Growth', 'Better ROI']
    },
    {
        title: 'Pay-Per-Click (PPC) & Paid Ads (Google & Meta Ads)',
        description: 'Strategic paid advertising campaigns for immediate visibility and leads.',
        category: 'marketing',
        features: ['Google Ads', 'Meta Ads', 'Campaign Management', 'Performance Tracking'],
        benefits: ['Immediate Results', 'Targeted Audience', 'Measurable ROI', 'Flexible Budget']
    },
    {
        title: 'Social Media Marketing (SMM & SMO)',
        description: 'Engaging social media content and strategies to build your brand presence.',
        category: 'marketing',
        features: ['Content Creation', 'Community Management', 'Analytics', 'Paid Social Campaigns'],
        benefits: ['Brand Awareness', 'Audience Engagement', 'Lead Generation', 'Increased Loyalty']
    },
    {
        title: 'Content Marketing',
        description: 'Strategic content creation and distribution to attract and retain your audience.',
        category: 'marketing',
        features: ['Blog Writing', 'Video Content', 'Infographics', 'Content Strategy'],
        benefits: ['Thought Leadership', 'Audience Trust', 'Long-term Traffic', 'Brand Authority']
    },
    {
        title: 'Email Marketing',
        description: 'Effective email campaigns to nurture leads and maintain customer relationships.',
        category: 'marketing',
        features: ['Campaign Design', 'Automation', 'Segmentation', 'Analytics'],
        benefits: ['Higher Engagement', 'Lead Nurturing', 'Cost Effective', 'Measurable Results']
    },
    {
        title: 'Conversion Rate Optimization (CRO)',
        description: 'Optimize your website to convert more visitors into customers.',
        category: 'marketing',
        features: ['A/B Testing', 'Heatmaps', 'User Behavior Analysis', 'Landing Page Optimization'],
        benefits: ['More Conversions', 'Better ROI', 'Improved UX', 'Reduced Cart Abandonment']
    },
    {
        title: 'Online Reputation Management (ORM)',
        description: 'Manage and enhance your online reputation across all platforms.',
        category: 'marketing',
        features: ['Review Management', 'Brand Monitoring', 'Crisis Management', 'Sentiment Analysis'],
        benefits: ['Positive Brand Image', 'Customer Trust', 'Quick Response', 'Better Visibility']
    },
    {
        title: 'Local SEO',
        description: 'Optimize your local online presence to attract nearby customers.',
        category: 'marketing',
        features: ['Google Business Profile', 'Local Listings', 'Location Keywords', 'Citation Building'],
        benefits: ['Local Visibility', 'Foot Traffic', 'Local Leads', 'Community Presence']
    }
];

const seedServices = async () => {
    try {
        await connectDB();

        // Check if services already exist
        const existingCount = await Service.countDocuments();

        if (existingCount > 0) {
            console.log(`⚠️  Found ${existingCount} existing service(s). Clearing them...`);
            await Service.deleteMany({});
        }

        // Insert services
        const result = await Service.insertMany(services);
        console.log(`✅ Successfully seeded ${result.length} services!`);

        // List all created services
        console.log('\n📋 Created Services:');
        result.forEach((service, index) => {
            console.log(`${index + 1}. ${service.title} (${service.category})`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Database disconnected');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding services:', error.message);
        process.exit(1);
    }
};

seedServices();
