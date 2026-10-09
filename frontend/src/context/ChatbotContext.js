import React, { createContext, useState, useCallback } from 'react';
import { CONTACT_CONFIG } from '../config/contactConfig';

export const ChatbotContext = createContext();

// FAQ Database - Moved outside component for performance
const faqDatabase = {
    'services': {
        keywords: ['services', 'what do you offer', 'offerings', 'solutions'],
        response: "We offer comprehensive services including:\n\n✅ Web Development - Build modern scalable applications\n✅ Mobile App Development - Native & cross-platform apps\n✅ UI/UX Design - Create stunning user interfaces\n✅ SEO Optimization - Improve your search rankings\n✅ Cloud Solutions - Deploy on AWS, Azure, GCP\n\nWould you like to know more about any specific service?"
    },
    'pricing': {
        keywords: ['pricing', 'cost', 'price', 'how much', 'rates'],
        response: "Our pricing varies based on project requirements:\n\n💰 Web Development: $5,000 - $20,000\n💰 Mobile Apps: $8,000 - $30,000\n💰 UI/UX Design: $3,000 - $12,000\n💰 SEO Services: $2,000 - $8,000\n💰 Cloud Solutions: $4,000 - $15,000\n\nFor a custom quote, please contact our team or use the contact form."
    },
    'contact': {
        keywords: ['contact', 'email', 'phone', 'reach', 'support'],
        response: `You can reach us through multiple channels:\n\n📧 Email: ${CONTACT_CONFIG.email.address}\n🌐 Website: Visit our website for more info\n📞 Contact Form: Available on our Contact page\n💬 Live Chat: You're already chatting with us!\n\nOur team typically responds within 24 hours.`
    },
    'timeline': {
        keywords: ['timeline', 'duration', 'how long', 'delivery', 'timeline'],
        response: "Project timelines vary based on complexity:\n\n⏱️ Small projects: 2-4 weeks\n⏱️ Medium projects: 1-3 months\n⏱️ Large projects: 3-6 months\n⏱️ Custom solutions: Custom timeline\n\nWe ensure timely delivery without compromising quality. Feel free to discuss specific timelines for your project!"
    },
    'team': {
        keywords: ['team', 'who are you', 'company', 'about', 'staff'],
        response: "Arviora Solution is a dedicated team of:\n\n👨‍💼 Expert Developers\n🎨 Creative Designers\n📊 Strategy Consultants\n🔧 DevOps Engineers\n\nWe specialize in helping businesses transform digitally. Learn more on our About page!"
    },
    'technology': {
        keywords: ['technology', 'tech stack', 'tools', 'framework', 'language'],
        response: "We work with modern technologies:\n\n🔹 Frontend: React, Vue, Angular\n🔹 Backend: Node.js, Python, Java\n🔹 Mobile: React Native, Flutter\n🔹 Cloud: AWS, Azure, Google Cloud\n🔹 Databases: MongoDB, PostgreSQL\n🔹 DevOps: Docker, Kubernetes\n\nWe choose the best tech for your specific needs!"
    },
    'blogs': {
        keywords: ['blog', 'blogs', 'articles', 'posts', 'news', 'stories', 'insights', 'read'],
        response: "📚 Check out our latest blog posts for insights, industry tips, and case studies! Click the button below to explore our blog.",
        action: 'navigate',
        link: '/blog'
    },
    'help': {
        keywords: ['help', 'support', 'urgent', 'immediately', 'problem', 'issue', 'stuck', 'error', 'emergency'],
        response: "I'd love to help! For immediate assistance, you can reach us via WhatsApp or Telegram. Our team responds quickly! 🚀",
        action: 'contact',
        contactMethods: ['whatsapp', 'telegram']
    }
};

export const ChatbotProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! 👋 Welcome to Arviora Solution. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);

    const toggleChatbot = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const getResponse = useCallback((userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        // Check FAQ database
        for (const [, data] of Object.entries(faqDatabase)) {
            if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return {
                    text: data.response,
                    action: data.action || null,
                    link: data.link || null,
                    contactMethods: data.contactMethods || null
                };
            }
        }

        // Default response with contact options
        return {
            text: `Thanks for your question! 😊 For more detailed information, you can contact us via WhatsApp, Telegram, or email at ${CONTACT_CONFIG.email.address}.`,
            action: 'contact',
            link: null,
            contactMethods: ['whatsapp', 'telegram']
        };
    }, []);

    const addMessage = useCallback((text, sender = 'user') => {
        const newMessage = {
            id: messages.length + 1,
            text,
            sender,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);

        // Auto-reply if user message
        if (sender === 'user') {
            const botResponse = getResponse(text);
            setTimeout(() => {
                const botMessage = {
                    id: messages.length + 2,
                    text: botResponse.text,
                    sender: 'bot',
                    timestamp: new Date(),
                    action: botResponse.action,
                    link: botResponse.link,
                    contactMethods: botResponse.contactMethods
                };
                setMessages(prev => [...prev, botMessage]);
            }, 500);
        }
    }, [messages, getResponse]);

    return (
        <ChatbotContext.Provider value={{
            isOpen,
            toggleChatbot,
            messages,
            addMessage,
            setMessages,
            getResponse
        }}>
            {children}
        </ChatbotContext.Provider>
    );
};
