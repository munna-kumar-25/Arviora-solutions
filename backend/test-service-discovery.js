require('dotenv').config();

const API_URL = 'http://localhost:5001/api';

const testServiceDiscovery = async () => {
    console.log('🔍 Testing Service Discovery\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Fetch all services
        console.log('\n📥 Fetching all services from backend...\n');
        const response = await fetch(`${API_URL}/services`);
        const data = await response.json();

        if (!data.success) {
            console.error('❌ API Error:', data.message);
            return;
        }

        console.log(`✅ Found ${data.count} services\n`);

        // Test 2: Check if the services match navbar items
        const navbarServices = [
            'Android & iOS App Development',
            'Cross-platform Apps',
            'Enterprise Applications',
            'App UI/UX Design',
            'Custom Website Development',
            'UI/UX Design',
            'E-commerce Development',
            'CMS-Based Websites',
            'Web Application Development',
            'Search Engine Optimization (SEO)',
            'Pay-Per-Click (PPC) & Paid Ads (Google & Meta Ads)',
            'Social Media Marketing (SMM & SMO)',
            'Content Marketing',
            'Email Marketing',
            'Conversion Rate Optimization (CRO)',
            'Online Reputation Management (ORM)',
            'Local SEO'
        ];

        console.log('📋 Comparing Navbar Services with Database:\n');

        let matchCount = 0;
        navbarServices.forEach(navService => {
            const dbService = data.services.find(s => s.title === navService);
            if (dbService) {
                console.log(`✅ FOUND: ${navService}`);
                matchCount++;
            } else {
                console.log(`❌ MISSING: ${navService}`);
            }
        });

        console.log(`\n📊 Match Status: ${matchCount}/${navbarServices.length} services found\n`);

        // Test 3: Check slug matching
        console.log('🔗 Testing Slug Conversion:\n');

        const toSlug = (str) => {
            return str
                .toLowerCase()
                .trim()
                .replace(/\//g, '-')
                .replace(/&/g, 'and')
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        };

        const testCases = [
            'Android & iOS App Development',
            'Pay-Per-Click (PPC) & Paid Ads (Google & Meta Ads)',
            'UI/UX Design'
        ];

        testCases.forEach(service => {
            const slug = toSlug(service);
            const match = data.services.find(s => toSlug(s.title) === slug);
            console.log(`Service: "${service}"`);
            console.log(`Slug: "${slug}"`);
            console.log(`Match: ${match ? '✅ YES' : '❌ NO'}\n`);
        });

        console.log('='.repeat(60));
        console.log('\n✅ All tests completed!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    process.exit(0);
};

// Wait for backend to be ready
setTimeout(testServiceDiscovery, 2000);
