const fetch = require('node-fetch');

async function testContactForm() {
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        subject: 'Test Message',
        message: 'This is a test message to check if emails are being sent'
    };

    console.log('\n📧 Testing Contact Form Email Service...\n');

    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const data = await response.json();

        console.log(`Status: ${response.status}`);
        console.log(`Response:`, JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ Message saved to database successfully!');
            console.log('Check: arviorasolutions@gmail.com inbox for admin notification');
        } else {
            console.log('\n❌ Error saving message');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testContactForm();
