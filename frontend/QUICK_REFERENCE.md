# Quick Reference: Contact Configuration

## 🔧 Update Contact Details - Quick Steps

### Step 1: Open Config File
```
src/config/contactConfig.js
```

### Step 2: Update Your Details

#### WhatsApp
```javascript
whatsapp: {
    number: '917492902760',                    // 👈 Update here (with country code)
    displayNumber: '+91 74929 02760',          // 👈 Update for display
    message: 'Hi Arviora Solution...'          // Optional: customize message
}
```

#### Telegram
```javascript
telegram: {
    handle: 'Arviora_Solution',                // 👈 Update handle (remove @)
}
```

#### Email
```javascript
email: {
    address: 'arviorasolution@gmail.com',      // 👈 Update email
    subject: 'Inquiry from Arviora Website'
}
```

#### Phone
```javascript
phone: {
    number: '+91 74929 02760'                  // 👈 Phone number with country code
}
```

### Step 3: Save & Test

---

## 📱 How Users See It

### In Chatbot
When user types "help" or "support":
```
🤖 Bot: For immediate assistance, contact us via:
🟢 [WhatsApp]
🔵 [Telegram]
📧 [Email link]
```

### Clicking Each Button
- **WhatsApp**: Opens `https://wa.me/917492902760`
- **Telegram**: Opens `https://t.me/Arviora_Solution`
- **Email**: Opens email client
- **Phone**: Opens phone dialer

---

## 🌍 Country Codes Reference

| Country | Code | Example |
|---------|------|---------|
| India | 91 | 917492902760 |
| Pakistan | 92 | 923001234567 |
| USA | 1 | 12025551234 |
| UK | 44 | 442071838750 |
| UAE | 971 | 971501234567 |
| Bangladesh | 880 | 8801700000000 |

---

## 🎯 Chatbot Keywords

These keywords trigger contact options:
- "help"
- "support"
- "urgent"
- "immediately"
- "problem"
- "issue"
- "stuck"
- "error"
- "emergency"

**Tip:** Add more keywords in `ChatbotContext.js` under the 'help' FAQ entry.

---

## 🚀 Using ContactOptions Component

### Basic
```jsx
import { ContactOptions } from './components/ContactOptions';

<ContactOptions />
```

### Horizontal Layout
```jsx
<ContactOptions layout="horizontal" />
```

### Only WhatsApp & Telegram
```jsx
<ContactOptions channels={['whatsapp', 'telegram']} />
```

### Small Size for Footer
```jsx
<ContactOptions size="small" showLabels={false} />
```

### All Channels
```jsx
<ContactOptions channels={['whatsapp', 'telegram', 'email', 'phone']} />
```

---

## ✅ Testing Checklist

- [ ] WhatsApp button opens correct link
- [ ] Telegram button opens correct chat
- [ ] Email button opens mail client
- [ ] Phone button opens dialer (on mobile)
- [ ] Chatbot shows options on "help" keyword
- [ ] Buttons work on mobile
- [ ] Links open in new tabs

---

## 📊 Files Modified

1. ✅ `src/config/contactConfig.js` - NEW - Centralized config
2. ✅ `src/components/ChatbotWidget.jsx` - Updated to use config
3. ✅ `src/context/ChatbotContext.js` - Updated to use config
4. ✅ `src/components/ContactOptions.jsx` - NEW - Reusable component
5. ✅ `frontend/WHATSAPP_TELEGRAM_INTEGRATION.md` - Full documentation

---

## 🔗 Links for Testing

- **WhatsApp**: https://wa.me/917492902760
- **Telegram**: https://t.me/Arviora_Solution
- **wa.me Info**: https://www.whatsapp.com/contact/

---

## ❓ FAQ

**Q: Why add country code to WhatsApp number?**
A: WhatsApp requires complete number with country code (e.g., +91 for India)

**Q: Can I use multiple WhatsApp numbers?**
A: Yes, add more entries to config like `whatsapp2`, `whatsapp3`

**Q: Do users need WhatsApp to click the button?**
A: No, wa.me creates a chat session online if they don't have the app

**Q: How to change chatbot keywords?**
A: Edit `ChatbotContext.js` in the FAQ Database section

**Q: Can I add more channels?**
A: Yes, extend `CONTACT_CONFIG` and `ContactOptions.jsx`

---

## 💡 Pro Tips

1. **Monitor which channel gets most clicks** (for future analytics)
2. **Keep messages pre-filled** (saves user typing time)
3. **Test on both desktop & mobile**
4. **Keep phone number consistent** across all platforms
5. **Add timezone info** when showing business hours

---

## 🎨 Styling

All components use Tailwind CSS. To customize colors:

```jsx
// In ContactOptions.jsx
const getChannelColor = (channel) => {
    const colors = {
        whatsapp: 'bg-green-500 hover:bg-green-600',      // 👈 Green
        telegram: 'bg-blue-500 hover:bg-blue-600',        // 👈 Blue
        email: 'bg-orange-500 hover:bg-orange-600',       // 👈 Orange
        phone: 'bg-purple-500 hover:bg-purple-600'        // 👈 Purple
    };
    return colors[channel.toLowerCase()] || 'bg-gray-500';
};
```

---

## 📞 Your Current Setup

**✅ WhatsApp**: +91 7492902760  
**✅ Telegram**: @Arviora_Solution  
**✅ Email**: arviorasolution@gmail.com  

Ready to use! 🚀
