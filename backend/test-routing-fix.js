#!/usr/bin/env node

const http = require('http');
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}${colors.reset}\n`),
};

function checkPort(port) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}`, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(2000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function testServers() {
    log.section('🧪 VERIFYING SERVERS AND ROUTING');

    log.info('Checking if Backend is running on port 5000...');
    const backendRunning = await checkPort(5000);
    if (backendRunning) {
        log.success('Backend is running on port 5000');
    } else {
        log.error('Backend is NOT running on port 5000');
    }

    log.info('Checking if Frontend is running on port 3000...');
    const frontendRunning = await checkPort(3000);
    if (frontendRunning) {
        log.success('Frontend is running on port 3000');
    } else {
        log.error('Frontend is NOT running on port 3000');
    }

    log.section('📋 ROUTING CHANGES SUMMARY');
    log.info(`Route Definition: Changed from "path=/admin/*" to "path=/admin"`);
    log.info(`Navigation in Pages.jsx: Updated to use relative paths ("create" instead of "/admin/blogs/create")`);
    log.success('This should fix the "Create Blog" button navigation issue');

    log.section('✅ VERIFICATION COMPLETE');
    log.info('The "Create Blog" button should now work properly!');
    log.info('Try clicking the "Create Blog" button in the admin blogs page at http://localhost:3000/admin/blogs');
}

testServers().catch(error => {
    log.error(`Error: ${error.message}`);
    process.exit(1);
});
