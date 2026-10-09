const Newsletter = require('../models/Newsletter');
const {
    sendNewsletterSubscriptionEmail,
    sendNewletterSubscriptionNotificationToAdmin,
    sendNewsletterEmail
} = require('../utils/emailService');

/**
 * Subscribe to Newsletter (Public)
 * POST /api/newsletter/subscribe
 */
const subscribeNewsletter = async (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address',
        });
    }

    try {
        // Check if already subscribed
        let subscriber = await Newsletter.findOne({ email });

        if (subscriber) {
            if (subscriber.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already subscribed to our newsletter',
                });
            } else {
                // Reactivate subscription
                subscriber.isActive = true;
                subscriber.unsubscribedAt = null;
                subscriber.subscribedAt = new Date();
                await subscriber.save();
            }
        } else {
            // Create new subscription
            subscriber = new Newsletter({
                email,
                subscribedAt: new Date(),
                isActive: true,
            });
            await subscriber.save();
        }

        // Send subscription confirmation email to user
        try {
            await sendNewsletterSubscriptionEmail({
                email,
            });

            // Send notification to admin
            await sendNewletterSubscriptionNotificationToAdmin({
                email,
            });
        } catch (emailError) {
            console.error('Email sending error:', emailError.message);
            // Don't fail the request if email fails
        }

        res.status(201).json({
            success: true,
            message: 'You have been successfully subscribed to our newsletter! Check your email for confirmation.',
            subscriber,
        });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to subscribe to newsletter',
        });
    }
};

/**
 * Unsubscribe from Newsletter (Public)
 * POST /api/newsletter/unsubscribe
 */
const unsubscribeNewsletter = async (req, res) => {
    const { email } = req.body;

    try {
        const subscriber = await Newsletter.findOneAndUpdate(
            { email },
            {
                isActive: false,
                unsubscribedAt: new Date(),
            },
            { new: true }
        );

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in our newsletter list',
            });
        }

        res.status(200).json({
            success: true,
            message: 'You have been unsubscribed from our newsletter',
            subscriber,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get All Newsletter Subscribers (Admin only)
 * GET /api/newsletter
 */
const getAllSubscribers = async (req, res) => {
    try {
        const { page = 1, limit = 50, isActive = true } = req.query;
        const skip = (page - 1) * limit;
        const filter = { isActive: isActive === 'true' };

        const total = await Newsletter.countDocuments(filter);
        const subscribers = await Newsletter.find(filter)
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
            subscribers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Send newsletter to all subscribers (Admin only)
 * POST /api/newsletter/send
 */
const sendNewsletterToAll = async (req, res) => {
    const { subject, message, htmlContent } = req.body;

    if (!subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Subject and message are required',
        });
    }

    try {
        const subscribers = await Newsletter.find({ isActive: true });

        if (subscribers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No active subscribers found',
            });
        }

        let successCount = 0;
        let failedCount = 0;

        for (const subscriber of subscribers) {
            try {
                // Send email to each subscriber
                await sendNewsletterEmail({
                    email: subscriber.email,
                    subject,
                    message,
                    htmlContent,
                });
                successCount++;
            } catch (error) {
                console.error(`Failed to send to ${subscriber.email}:`, error.message);
                failedCount++;
            }
        }

        res.status(200).json({
            success: true,
            message: `Newsletter sent successfully`,
            stats: {
                total: subscribers.length,
                success: successCount,
                failed: failedCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    subscribeNewsletter,
    unsubscribeNewsletter,
    getAllSubscribers,
    sendNewsletterToAll,
};
