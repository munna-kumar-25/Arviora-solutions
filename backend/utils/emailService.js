const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Send contact notification email to admin
 * @param {Object} contactData - { name, email, phone, subject, message }
 */
const sendContactNotificationToAdmin = async (contactData, recipients = process.env.EMAIL_USER) => {
    const { name, email, phone, subject, message, requestType, company, service, preferredDate, preferredTime } = contactData;

    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
        to: recipients,
        subject: `${requestType === 'demo' ? 'New Demo Request' : 'New Contact Message'}: ${subject || 'No Subject'}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">${requestType === 'demo' ? 'New Demo Request from Arviora Website' : 'New Contact Message from Arviora Website'}</h2>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                    ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
                    ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
                    ${preferredDate ? `<p><strong>Preferred date:</strong> ${preferredDate}</p>` : ''}
                    ${preferredTime ? `<p><strong>Preferred time:</strong> ${preferredTime}</p>` : ''}
                    <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
                </div>

                <div style="background-color: #fafafa; padding: 15px; border: 1px solid #ddd; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; word-break: break-word;">${message}</p>
                </div>

                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    This is an automated email. Please reply to <a href="mailto:${email}">${email}</a> to respond to the customer.
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

const sendTestNotificationEmail = async (recipient) => {
    return transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
        to: recipient,
        subject: 'Test notification - Arviora Solutions',
        text: 'Your Arviora admin notification email is configured correctly.',
        html: '<p>Your Arviora admin notification email is configured correctly.</p>',
    });
};

/**
 * Send confirmation email to user
 * @param {Object} contactData - { name, email, subject }
 */
const sendConfirmationEmailToUser = async (contactData) => {
    const { name, email } = contactData;

    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
        to: email,
        subject: 'We Received Your Message - Arviora Solutions',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Thank You for Contacting Us!</h2>
                
                <p>Hi ${name},</p>

                <p>We have received your message and appreciate you reaching out to Arviora Solutions. Our team will review your inquiry and get back to you as soon as possible.</p>

                <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                    <p><strong>What's next?</strong></p>
                    <ul>
                        <li>Our team will review your message within 24-48 hours</li>
                        <li>We'll send you a detailed response via email</li>
                        <li>If urgent, feel free to call us directly</li>
                    </ul>
                </div>

                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>Arviora Solutions Team</strong>
                </p>

                <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
                    © 2024 Arviora Solutions. All rights reserved.
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Send newsletter subscription confirmation email
 * @param {Object} data - { email }
 */
const sendNewsletterSubscriptionEmail = async (data) => {
    const { email } = data;

    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
        to: email,
        subject: 'Welcome to Arviora Solutions Newsletter!',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Welcome to Arviora Solutions Newsletter!</h2>
                
                <p>Thank you for subscribing to our newsletter!</p>

                <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                    <p><strong>What to expect:</strong></p>
                    <ul>
                        <li>Latest updates on our services and products</li>
                        <li>Exclusive insights and technology trends</li>
                        <li>Special offers and promotions</li>
                        <li>Tips and best practices for digital transformation</li>
                    </ul>
                </div>

                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>Arviora Solutions Team</strong>
                </p>

                <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
                    You can unsubscribe anytime by clicking the unsubscribe link in our emails.<br>
                    © 2024 Arviora Solutions. All rights reserved.
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Send newsletter subscription notification to admin
 * @param {Object} data - { email }
 */
const sendNewletterSubscriptionNotificationToAdmin = async (data) => {
    const { email } = data;

    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
        to: process.env.EMAIL_USER,
        subject: `New Newsletter Subscriber: ${email}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">New Newsletter Subscriber</h2>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
                </div>

                <p>A new user has subscribed to your newsletter.</p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Send newsletter to a single subscriber
 * @param {Object} data - { email, subject, message, htmlContent }
 */
const sendNewsletterEmail = async (data) => {
    const { email, subject, message, htmlContent } = data;

    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
        to: email,
        subject: subject,
        html: htmlContent || `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">${subject}</h2>
                <p style="white-space: pre-wrap; word-break: break-word;">${message}</p>
                
                <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>Arviora Solutions Team</strong>
                </p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};

/**
 * Test email connection
 */
const testEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Email service is ready to send messages');
        return true;
    } catch (error) {
        console.error('❌ Email service error:', error.message);
        return false;
    }
};

module.exports = {
    sendContactNotificationToAdmin,
    sendConfirmationEmailToUser,
    sendTestNotificationEmail,
    sendNewsletterSubscriptionEmail,
    sendNewletterSubscriptionNotificationToAdmin,
    sendNewsletterEmail,
    testEmailConnection,
};
