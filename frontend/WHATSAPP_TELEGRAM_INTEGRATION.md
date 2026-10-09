# WhatsApp & Telegram Integration Guide

## Overview
Your Arviora Solution chatbot now has fully integrated WhatsApp and Telegram contact options. Users can easily reach out through their preferred communication channel.

## Configuration

### Contact Information
All contact details are managed in a centralized config file: **`src/config/contactConfig.js`**

Current Configuration:
- **WhatsApp**: +91 7492902760
- **Telegram**: @Arviora_Solution
- **Email**: arviorasolution@gmail.com

### How to Update Contact Information

1. Open: `src/config/contactConfig.js`
2. Update the respective fields:

```javascript
whatsapp: {
    number: '917492902760',  // Country code + number
    displayNumber: '+91 74929 02760'
}

telegram: {
    handle: 'Arviora_Solution'  // Your Telegram handle
}

email: {
    address: 'arviorasolution@gmail.com'
}

phone: {
    number: '+91 74929 02760'
}
```

## Components Using Contact Integration

### 1. ChatbotWidget.jsx
The floating chatbot automatically shows WhatsApp and Telegram buttons when users:
- Ask for help
- Request contact information
- Ask urgent questions

### 2. ContactOptions.jsx (New)
A reusable component to display contact channels anywhere on your site.

**Usage Example:**
```jsx
import { ContactOptions } from './components/ContactOptions';

// Basic usage
<ContactOptions />

// Horizontal layout
<ContactOptions layout="horizontal" />

// Specific channels only
<ContactOptions channels={['whatsapp', 'telegram']} />

// Without labels
<ContactOptions showLabels={false} size="small" />

// Large buttons
<ContactOptions size="large" />
```

**Props:**
- `channels`: Array of channels to display (`['whatsapp', 'telegram', 'email', 'phone']`)
- `layout`: 'vertical' or 'horizontal'
- `size`: 'small', 'default', or 'large'
- `showLabels`: Show/hide channel names
- `className`: Additional CSS classes

## How It Works

### Chatbot Flow
1. User opens chatbot and types a message
2. Chatbot analyzes keywords and provides relevant response
3. If user asks for help/contact, WhatsApp/Telegram buttons appear
4. Clicking buttons opens chat in new tab:
   - **WhatsApp**: Opens with pre-filled message
   - **Telegram**: Opens direct chat link

### Tech Stack
- **Frontend**: React
- **State Management**: Context API
- **Animations**: Framer Motion
- **Communication**: wa.me (WhatsApp) & Telegram links

## Keywords That Trigger Contact Options

The chatbot shows contact options when users mention:
- "help", "support", "urgent", "immediately"
- "problem", "issue", "stuck", "error", "emergency"

## Customization Ideas

### 1. Add More Contact Channels
Update `src/config/contactConfig.js`:
```javascript
export const CONTACT_CONFIG = {
    // ... existing code
    viber: {
        number: '+917492902760',
        name: 'Viber',
        getUrl: function() {
            return `viber://chat?number=%2B${this.number}`;
        }
    }
};
```

### 2. Add Different Messages
Customize pre-filled messages in `contactConfig.js`:
```javascript
whatsapp: {
    message: 'Hi! I would like more information about...'
}
```

### 3. Add Business Hours Indicator
Enhance responses based on time:
```javascript
// In ChatbotContext.js
const getBusinessStatus = () => {
    const hour = new Date().getHours();
    return hour >= 9 && hour <= 18 ? 'open' : 'closed';
};
```

### 4. Display on Multiple Pages
Add ContactOptions component to:
- Footer
- Services page
- Contact page
- Blog pages

## Testing

### Test WhatsApp Integration
1. Click ChatbotWidget
2. Type "help" or "support"
3. Click WhatsApp button
4. Should open: `https://wa.me/917492902760`

### Test Telegram Integration
1. Click ChatbotWidget
2. Type "help"
3. Click Telegram button
4. Should open Telegram app or web interface

## Troubleshooting

### WhatsApp Button Not Working
- Verify number includes country code: `917492902760` (for India)
- Format: `[countryCode][number]` without + or spaces

### Telegram Button Not Working
- Ensure Telegram handle is correct: `@Arviora_Solution`
- User must have Telegram account/app installed

### Messages Not Pre-filled
- Check message encoding in `getUrl()` function
- Use `encodeURIComponent()` for special characters

## Analytics (Future Enhancement)

Track contact channel usage:
```javascript
const trackContactClick = (channel) => {
    analyticsAPI.trackEvent('contact_clicked', { channel });
};
```

## Mobile Optimization

Contact options are fully responsive:
- Buttons stack vertically on mobile
- Touch-friendly button sizes
- Full-screen chat on mobile browsers

## Security Notes

- WhatsApp numbers shown publicly (published format)
- Telegram handle is public
- Consider rate limiting on backend
- Validate messages before processing

## Next Steps

1. ✅ Test on mobile devices
2. ✅ Monitor which channels get most traffic
3. ✅ Consider adding AI routing based on message type
4. ✅ Add analytics dashboard
5. ✅ Implement chatbot response logging

## Support

For issues or questions about the integration:
- Check the chatbot keywords in `ChatbotContext.js`
- Review configuration in `src/config/contactConfig.js`
- Ensure all components are imported correctly
