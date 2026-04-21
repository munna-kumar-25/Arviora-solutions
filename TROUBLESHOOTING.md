# 🔧 TROUBLESHOOTING GUIDE

## Issue 1: "Cannot GET /api/services" (Backend Not Running)

### Symptoms:
- Browser shows: `Cannot GET /api/services`
- Terminal 2 shows red errors
- Frontend connected but no data

### Solution:
```powershell
# Terminal 1: Check backend
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"

# Did you run: npm run dev ?
npm run dev

# WATCH for:
# ✅ Server running on port 5000
# ✅ MongoDB Connected

# If you see those ✅, backend is working!
```

---

## Issue 2: "MongoDB Connected ❌" (Database Connection Failed)

### Symptoms:
- Terminal 1 shows: `❌ MongoDB Connected: false`
- Or: `(node:1234) MongoServerSelectionError`
- Data not saving

### Causes:
1. Internet connection down
2. MONGODB_URI wrong in .env
3. MongoDB Atlas IP whitelist issue
4. Firewall blocking connection

### Solution:
```powershell
# Step 1: Check .env file
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"
Type .env
# Should show:
# MONGODB_URI=mongodb+srv://ar6524318_db_user:...

# Step 2: Test if internet working
# Open any website in browser (google.com)

# Step 3: Check if MongoDB Atlas allows your IP
# https://cloud.mongodb.com/
# Login with: arviorasolution@gmail.com / Arviora@29
# Go to: Network Access
# Should see: 0.0.0.0/0 (means all IPs allowed)

# Step 4: If still not working, restart backend:
Ctrl+C  # Stop backend
npm run dev  # Start again
```

---

## Issue 3: Admin Login Not Working

### Symptoms:
- "Invalid credentials" error
- "User not found" error
- Login button doesn't respond

### Solution:

#### First: Check admin user exists
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"

# Check if you can login on admin page
# Go to: http://localhost:3000/login
# Try:
#   Email: arviorasolution@gmail.com
#   Password: Arviora@29
```

#### If login fails, create admin user:
```powershell
# In backend folder:
node setup-admin.js

# Wait for: ✅ Admin user created/updated
# Then go back to login page and try again
```

#### Check backend logs:
```powershell
# Terminal 1 (where npm run dev is running)
# Look for login attempt logs

# You should see:
# POST /api/auth/login
# [email] login attempt
# [email] login successful
```

---

## Issue 4: Data Not Showing on Website

### Symptoms:
- Add service in admin → works
- Go to home page → no service shows
- Services section is empty

### Solution:

#### Step 1: Check backend API directly
```powershell
# Open browser and go to:
http://localhost:5000/api/services

# Should show JSON data:
# [
#   { _id: "...", name: "Service 1", ... },
#   ...
# ]

# If you see [], database has no data
# If you see error, API is broken
```

#### Step 2: Check if AppContext is fetching
```javascript
// In frontend browser console (F12)
// Type:
console.log(window.localStorage.getItem('services'))

// Should show array of services
// If it shows null, AppContext didn't fetch
```

#### Step 3: Refresh frontend
```powershell
# Terminal 2:
Ctrl+C  # Stop frontend

npm start  # Start again
# Wait for browser to load
```

---

## Issue 5: Images Not Uploading

### Symptoms:
- Add service with image → succeeds
- But image doesn't show
- Or: "File too large" error

### Solution:

#### Step 1: Check uploads folder
```powershell
# In backend folder:
# Should have folder: backend\uploads\

# If missing, create it:
mkdir uploads

# Then restart backend:
Ctrl+C
npm run dev
```

#### Step 2: Check image file size
```
Max file size: 5 MB (5,242,880 bytes)

Your image should be smaller.
Most images are under 2 MB.

Upload a smaller image or compress first.
```

#### Step 3: Check image format
```
Allowed types: jpg, png, gif, webp

Make sure your image is one of these.
Not: bmp, tiff, ico, etc.
```

#### Step 4: Check Multer configuration
```powershell
# File: backend/middleware/uploadMiddleware.js
# Check that file upload is configured properly:

# Should show:
# - uploads/ directory
# - 5MB limit
# - jpg, png, gif, webp allowed
```

---

## Issue 6: Data Disappears After Refresh

### Symptoms:
- Add data → shows immediately
- Refresh page (F5) → data gone
- Restart backend → data gone

### Diagnosis:

#### Check 1: Is data actually saving?
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"

# Run diagnostic:
node test-complete.js

# Look for API responses:
# - GET /api/services → should show data
# - GET /api/blogs → should show data
# - GET /api/testimonials → should show data

# If you see [], data didn't save to MongoDB
# If you see data, MongoDB is working
```

#### Check 2: Is MongoDB connection dropping?
```powershell
# Terminal 1: Watch the logs while you:
# 1. Add a service in admin
# 2. Refresh page
# 3. Restart backend

# Terminal 1 should show:
# POST /api/services (save successful)
# GET /api/services (fetch works)
# ✅ MongoDB Connected (stays after restart)

# If you see ❌ MongoDB after adding data, that's the problem
```

#### Check 3: Is AppContext refetching?
```javascript
// In frontend browser console (F12):

// First, add a service in admin
// Then refresh page

// Type:
fetch('http://localhost:5000/api/services')
  .then(r => r.json())
  .then(data => console.log('Data:', data))

// This shows what server actually has
// If data is here but not on page, AppContext isn't fetching
```

---

## Issue 7: "Adjacent JSX elements" Error

### Symptoms:
- Browser shows: `Adjacent JSX elements must be wrapped in enclosing tag`
- Admin page blank/broken
- Red error in browser console

### Solution:
```powershell
# Terminal 2 (frontend):
Ctrl+C  # Stop frontend

# Full restart:
npm start

# Frontend should recompile and work

# If still broken:
# 1. Check for syntax errors in admin files
# 2. Look at browser console (F12) for exact location
# 3. Fix JSX wrapping
```

---

## Issue 8: Ports Already In Use

### Symptoms:
- `Error: listen EADDRINUSE: address already in use :::5000`
- Or: `listen EADDRINUSE :::3000`
- "address already in use" error

### Solution:

#### Find what's using port 5000:
```powershell
# Find process using port 5000:
netstat -ano | findstr :5000

# Output: TCP ... ... ... [PID number]
# Kill it:
taskkill /PID [PID number] /F

# OR just use different port:
# In .env, change PORT=5001
# Run: npm run dev
```

#### Find what's using port 3000:
```powershell
# Find process using port 3000:
netstat -ano | findstr :3000

# Kill it:
taskkill /PID [PID number] /F

# Or in package.json, use different port
```

---

## Issue 9: CORS Error

### Symptoms:
- `Access to XMLHttpRequest ... has been blocked by CORS policy`
- Frontend can't connect to backend API
- Browser console shows red error

### Solution:
```powershell
# File: backend/server.js
# Should have CORS configuration:

const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

# If missing, add the above lines
# Then restart backend:
Ctrl+C
npm run dev
```

---

## Issue 10: "Cast to ObjectId failed" Error

### Symptoms:
- Delete button throws error
- Edit operation fails
- Backend error: `Cast to ObjectId failed for value undefined`

### Solution:
```javascript
// This means you're sending wrong ID to backend

// Frontend should send:
item._id  // MongoDB's ObjectId format

// NOT:
item.id   // This is undefined

// Check all delete/edit calls use ._id
// File: frontend/src/components/Cards.jsx
// Should be:
onClick={() => onDelete(item._id)}  // Correct
onClick={() => onDelete(item.id)}   // Wrong
```

---

## Issue 11: "Unauthorized" or "401 Errors"

### Symptoms:
- Protected routes show: `Unauthorized`
- `401 Invalid Token`
- Can't access admin panel after login

### Solution:
```powershell
# Check 1: Is token being saved?
# Browser console (F12):
console.log(localStorage.getItem('token'))

# Should show: eyJhbGc... (long string)
# If nothing, token not saved after login

# Check 2: Backend JWT configuration
# File: backend/.env
# Should have: JWT_SECRET=your_secret

# Check 3: Clear localStorage and login again
# Browser console:
localStorage.clear()
# Then goto: http://localhost:3000/login
# Login again
```

---

## Issue 12: Blog Category Error

### Symptoms:
- Create blog → `category validation failed`
- "Web Development is not valid enum"
- Can't save blog posts

### Solution:
```powershell
# The blog form needs to send lowercase category

# File: frontend/src/components/Forms.jsx

# Check BlogForm dropdown:
<select value={formData.category}>
  <option value="web development">Web Development</option>
  <option value="mobile development">Mobile Dev</option>
  ...
</select>

# Values must be lowercase (value="...")
# These EXACT values must match backend schema
```

---

## 🚨 Still Broken? Emergency Debug

### Run this to see EVERYTHING:
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"
node test-complete.js
```

This runs tests and shows:
- ✅ Backend health
- ✅ MongoDB connection
- ✅ All API endpoints
- ✅ Authentication
- ✅ Whether data is actually being saved

### Output tells you exactly what's working/broken

### If test fails at step X:
- That's where your problem is
- Check that component in code
- Fix, restart, try again

---

## 📞 Still Need Help?

Check these files in order:
1. `VERIFICATION_CHECKLIST.md` → Do all checks pass?
2. This file (TROUBLESHOOTING.md) → Match your error to issue
3. Terminal logs → Red error messages show exactly what broke
4. Browser console (F12) → Frontend error messages
5. Backend .env file → Check configuration values
6. MongoDB Atlas dashboard → Check if data is actually in database

**Remember:**
- Backend must run FIRST (Terminal 1)
- Frontend must run SECOND (Terminal 2)
- Both must show NO red errors
- MongoDB must show ✅ Connected
