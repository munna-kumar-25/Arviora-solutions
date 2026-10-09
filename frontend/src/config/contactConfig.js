/**
 * Centralized Contact Configuration
 * Manage all communication channels from one place
 */

export const CONTACT_CONFIG = {
    // WhatsApp Configuration
    whatsapp: {
        number: '917492902760', // Country code + number (India: +91)
        displayNumber: '+91 74929 02760',
        name: 'WhatsApp',
        message: 'Hi Arviora Solution, I would like to know more about your services.',
        getUrl: function () {
            const encodedMessage = encodeURIComponent(this.message);
            return `https://wa.me/${this.number}?text=${encodedMessage}`;
        }
    },

    // Telegram Configuration
    telegram: {
        handle: 'Arviora_Solution',
        name: 'Telegram',
        getUrl: function () {
            return `https://t.me/${this.handle}`;
        }
    },

    // Email Configuration
    email: {
        address: 'arviorasolution@gmail.com',
        name: 'Email',
        subject: 'Inquiry from Arviora Website',
        getUrl: function () {
            return `mailto:${this.address}?subject=${encodeURIComponent(this.subject)}`;
        }
    },

    // Phone Configuration (optional)
    phone: {
        number: '+91 74929 02760',
        name: 'Phone',
        getUrl: function () {
            return `tel:${this.number.replace(/\s+/g, '')}`;
        }
    },

    // Get all available channels
    getAllChannels: function () {
        return ['whatsapp', 'telegram', 'email', 'phone'];
    },

    // Get specific channel config
    getChannel: function (channel) {
        return this[channel.toLowerCase()];
    }
};

export default CONTACT_CONFIG;
