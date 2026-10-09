import React from 'react';

export const Logo = ({ size = 32, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0891B2', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                </filter>
            </defs>

            {/* Main Circle Background */}
            <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" opacity="0.08" />

            {/* Outer Ring */}
            <circle cx="32" cy="32" r="28" fill="none" stroke="url(#logoGradient)" strokeWidth="2.5" opacity="0.6" />

            {/* Modern "A" Design */}
            <g fill="url(#logoGradient)" filter="url(#shadow)">
                {/* Left part of A */}
                <path d="M 20 48 L 32 16 L 44 48 Z" fill="url(#logoGradient)" opacity="0.9" />

                {/* Horizontal bar of A */}
                <rect x="25" y="34" width="14" height="2.5" rx="1" fill="url(#logoGradient)" opacity="1" />
            </g>

            {/* Tech dots - representing technology/innovation */}
            <circle cx="48" cy="20" r="2.5" fill="#06B6D4" opacity="0.8" />
            <circle cx="52" cy="28" r="1.8" fill="#4F46E5" opacity="0.6" />

            {/* Corner accent line - representing growth */}
            <line x1="12" y1="50" x2="24" y2="40" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
        </svg>
    );
};

export default Logo;
