# Email Setup Guide

## How to Set Up Gmail App Password

Contact form emails will be sent using Gmail. Follow these steps to enable email sending:

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account](https://myaccount.google.com)
2. Click on **Security** in the left sidebar
3. Scroll down and look for **How you sign in to Google**
4. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password

1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. Look for **App passwords** (appears only after 2FA is enabled)
3. Select: **Mail** and **Windows Computer** (or your device)
4. Click **Generate**
5. Google will show you a 16-character password
6. **Copy this password**

### Step 3: Update .env File

1. Open `backend/.env`
2. Find this line:
   ```
   EMAIL_PASSWORD=your_gmail_app_password_here
   ```
3. Replace `your_gmail_app_password_here` with the 16-character password from Step 2
4. Make sure EMAIL_USER is set to: `arviorasolutions@gmail.com`
5. Save the file

**Example:**
```
EMAIL_USER=arviorasolutions@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Restart Backend

After updating the .env file, restart the backend server:

```bash
cd backend
npm run dev
```

### Testing Email Configuration

When the backend starts, it will verify the email connection. You should see one of:

✅ **Success:**
```
✅ Email service is ready to send messages
```

❌ **Error:**
```
❌ Email service error: [error message]
```

If you see an error, double-check:
- Gmail App Password is correct (16 characters with spaces)
- 2-Factor Authentication is enabled
- Gmail account is `arviorasolution@gmail.com`

## Email Workflow

### When Contact Form is Submitted:

1. **Database**: Message is saved to MongoDB
2. **Admin Email**: arviorasolution@gmail.com receives notification with full details
3. **User Email**: Customer receives confirmation email

### Email Contents:

**Admin Notification:**
- Sender name and email
- Contact details (phone if provided)
- Full message content
- Reply-to button ready

**User Confirmation:**
- Thank you message
- Expected response time (24-48 hours)
- Professional branding

## Important Notes

- If email sending fails, the contact message is **still saved** to the database
- Admin can view all messages in the Admin Panel → Contacts section
- This uses Gmail's SMTP service - **requires active Gmail account**
- App Password is secure - different from regular Gmail password
- For production, consider using SendGrid or other professional email services

## Troubleshooting

### Email not working?

1. Check `.env` file has correct Email Password (16 chars with spaces)
2. Ensure 2FA is enabled on Gmail account
3. Check that arviorasolution@gmail.com is the correct Gmail account
4. Restart backend after updating .env

### Still having issues?

Check backend console logs when contact form is submitted:
```
npm run dev
# Then submit a test contact form
# Look for error messages in the backend console
```
