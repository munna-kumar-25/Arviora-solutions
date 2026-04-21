# Admin Login Fix Guide

## Problem
When logging into the admin panel, the first time works but when running again, it shows "Failed to fetch" error.

## Root Cause
- Backend server (port 5000) is closed or not responding
- MongoDB connection is timing out
- Connection is not happening between Frontend and Backend

## Solution

### Step 1: Start Backend Properly

```bash
cd backend
npm install
node server.js
```

You should see:
```
==================================================
✅ Arviora Solutions Backend Server Running
📝 Server: http://localhost:5000
🔗 API Base: http://localhost:5000/api
📱 Frontend: http://localhost:3000
🗄️  Database: Connected
📦 Environment: development
==================================================
```

### Step 2: Start Frontend in Another Terminal

```bash
cd frontend
npm install
npm start
```

### Step 3: Check Backend Before Logging In

Before opening the frontend admin login page, check that backend is running:

```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-04-11T12:00:00.000Z"
}
```

## Default Admin Credentials

```
Email: admin@arviora.com
Password: admin123
```

If these don't work, first run setup-admin.js:

```bash
cd backend
node setup-admin.js
```

## Common Issues

### ❌ "Cannot connect to server. Please check if backend is running on port 5000"
- Backend server is not running
- Run `node server.js`

### ❌ "Database connection error. Please try again."
- MongoDB connection issue
- Check if MONGO_URI is correct in .env
- Check if MongoDB account is active

### ❌ "Invalid credentials"
- Email or password is wrong
- See default credentials above

## Improvements Made

1. ✅ **Health Check**: Backend is checked before login
2. ✅ **Retry Logic**: Failed requests retry 3 times
3. ✅ **Better Error Messages**: Now shows better error messages
4. ✅ **DB Connection Pooling**: Handles MongoDB better
5. ✅ **Graceful Shutdown**: Server shuts down gracefully

## Testing

After logging in:
- Reload the Dashboard ✓
- Close and reopen the browser ✓
- Close and reopen the tab ✓

Now everything will work!
