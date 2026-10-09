# Email Notification Setup Guide

This guide helps you set up email notifications for the contact form.

## Step 1: Install EmailJS Package

```bash
npm install @emailjs/browser
```

## Step 2: Get EmailJS Credentials

1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Go to **Admin Panel** → **Add Service**
4. Select **Gmail** as the service
5. Follow the instructions to connect your Gmail account (arviorasolutions@gmail.com)
6. Copy your **Service ID** (looks like: `service_xxxxxxxxx`)
7. Go to **API Keys** and copy your **Public Key** (looks like: `xxxxxxxxxxxxxxxxxxxx`)

## Step 3: Create Email Template

1. In EmailJS Admin Panel, go to **Email Templates**
2. Create a new template with these variables:
   - `to_email` - Recipient email
   - `from_name` - Sender name
   - `from_email` - Sender email
   - `subject` - Email subject
   - `message` - Email message
   - `reply_to` - Reply to email

3. Copy the **Template ID** (looks like: `template_xxxxxxxxx`)

## Step 4: Update Configuration

Edit `src/components/Forms.jsx` and update these lines:

```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';      // Replace with your public key
const EMAILJS_SERVICE_ID = 'gmail';                      // Keep as 'gmail' if using Gmail
const EMAILJS_TEMPLATE_ID = 'template_contact_form';     // Replace with your template ID
```

## Step 5: Test

1. Run the project: `npm start`
2. Fill out the contact form
3. You should receive an email at arviorasolutions@gmail.com
4. The user should also receive a confirmation email

## Email Notifications Sent

✅ When someone fills the contact form:
1. **Admin Email** - Notification sent to arviorasolutions@gmail.com with the contact details
2. **User Email** - Confirmation email sent to the user's email address

## Important Notes

- Keep your **Public Key** in the code (it's meant to be public)
- Never expose your **Gmail password** - use EmailJS OAuth instead
- Free tier allows 200 emails/month
- For more emails, upgrade your EmailJS plan

## Troubleshooting

If emails don't send:
1. Check that your Gmail account is connected to EmailJS
2. Verify your Service ID and Template ID are correct
3. Check browser console for error messages
4. Ensure the template variables match `{to_email}`, `{from_name}`, etc.
