import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send as SendIcon, Mail, Phone } from 'react-feather';
import { CONTACT_CONFIG } from '../config/contactConfig';

/**
 * Contact Options Component
 * Displays WhatsApp, Telegram, Email, and Phone contact options
 */
export const ContactOptions = ({
    channels = ['whatsapp', 'telegram', 'email', 'phone'],
    layout = 'vertical', // 'vertical' or 'horizontal'
    size = 'default', // 'default', 'small', 'large'
    className = '',
    showLabels = true
}) => {
    const sizeClasses = {
        small: 'px-2 py-1 text-xs gap-1',
        default: 'px-4 py-2 text-sm gap-2',
        large: 'px-6 py-3 text-base gap-3'
    };

    const iconSizes = {
        small: 12,
        default: 16,
        large: 20
    };

    const containerClass = layout === 'horizontal'
        ? 'flex flex-row flex-wrap gap-3'
        : 'flex flex-col gap-2';

    const getChannelIcon = (channel) => {
        const iconProps = { size: iconSizes[size] };
        switch (channel.toLowerCase()) {
            case 'whatsapp':
                return <MessageSquare {...iconProps} />;
            case 'telegram':
                return <SendIcon {...iconProps} />;
            case 'email':
                return <Mail {...iconProps} />;
            case 'phone':
                return <Phone {...iconProps} />;
            default:
                return null;
        }
    };

    const getChannelColor = (channel) => {
        const colors = {
            whatsapp: 'bg-green-500 hover:bg-green-600',
            telegram: 'bg-blue-500 hover:bg-blue-600',
            email: 'bg-orange-500 hover:bg-orange-600',
            phone: 'bg-purple-500 hover:bg-purple-600'
        };
        return colors[channel.toLowerCase()] || 'bg-gray-500 hover:bg-gray-600';
    };

    const getChannelUrl = (channel) => {
        const config = CONTACT_CONFIG.getChannel(channel);
        return config?.getUrl?.() || '#';
    };

    return (
        <div className={`${containerClass} ${className}`}>
            {channels.map((channel) => {
                const config = CONTACT_CONFIG.getChannel(channel);
                if (!config) return null;

                return (
                    <motion.a
                        key={channel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={getChannelUrl(channel)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            flex items-center justify-center gap-2 
                            rounded-full font-semibold text-white 
                            hover:shadow-lg transition
                            ${sizeClasses[size]} 
                            ${getChannelColor(channel)}
                        `}
                        title={`Contact us via ${config.name}`}
                    >
                        {getChannelIcon(channel)}
                        {showLabels && config.name}
                    </motion.a>
                );
            })}
        </div>
    );
};

export default ContactOptions;
