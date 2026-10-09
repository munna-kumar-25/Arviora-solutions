/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium SaaS Color System - Dark Mode (Default)
        'brand-primary': '#4F46E5', // Indigo
        'brand-secondary': '#06B6D4', // Cyan
        'brand-dark': '#0F172A', // Deep Navy
        'brand-surface': '#1E293B', // Dark Gray-Blue
        'brand-text': '#FFFFFF', // White
        'brand-text-secondary': '#94A3B8', // Gray

        // Light Mode Variants
        'brand-light-bg': '#FFFFFF', // White background
        'brand-light-surface': '#F8FAFC', // Light surface
        'brand-light-text': '#1F2937', // Dark text
        'brand-light-text-secondary': '#6B7280', // Light gray text

        // Extended palette
        'brand-indigo': {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        'brand-cyan': {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
        'gradient-brand-reverse': 'linear-gradient(135deg, #06B6D4 0%, #4F46E5 100%)',
      },
      boxShadow: {
        'glow-brand': '0 0 20px rgba(79, 70, 229, 0.3)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideInUp: 'slideInUp 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(79, 70, 229, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(79, 70, 229, 0.6)',
          },
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

