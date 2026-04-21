# 🚀 ARVIORA SOLUTION - COMPLETE SETUP GUIDE

## ✅ CHECKLIST - Follow These Steps in Order

### STEP 1: START BACKEND SERVER
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"
npm run dev
```
✓ Wait until you see: `✅ Server running on port 5000`
✓ Wait until you see: `✅ MongoDB Connected`

---

### STEP 2: VERIFY BACKEND IS WORKING
In a NEW terminal (keep backend running):
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"
node test-complete.js
```
✓ This will check:
  - Backend server is running
  - MongoDB is connected
  - Admin user exists
  - All endpoints are working

---

### STEP 3: CREATE ADMIN USER (if needed)
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"
node setup-admin.js
```
✓ Output should say: `✅ Admin created successfully!`
✓ Admin Email: `arviorasolution@gmail.com`
✓ Admin Password: `Arviora@29`

---

### STEP 4: START FRONTEND
In a NEW terminal (keep backend running):
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\frontend"
npm start
```
✓ Wait until browser opens at http://localhost:3000

---

### STEP 5: LOGIN TO ADMIN PANEL
1. Click: http://localhost:3000/login
2. Enter Email: `arviorasolution@gmail.com`
3. Enter Password: `Arviora@29`
4. Click: **Login**
5. Should redirect to: http://localhost:3000/admin ✓

---

### STEP 6: ADD DATA (Services, Blogs, Testimonials)
1. In Admin Panel, click: **Services** / **Blogs** / **Testimonials**
2. Click: **+ Add New** button
3. Fill in the form
4. Upload image (smaller than 5MB)
5. Click: **Save**
6. ✓ Should see success message

---

### STEP 7: VIEW DATA ON WEBSITE
1. Go to: http://localhost:3000
2. Scroll down to see:
   - ✓ Services displayed
   - ✓ Blogs displayed
   - ✓ Testimonials displayed

---

### STEP 8: VERIFY DATA PERSISTENCE
1. Refresh the page: F5
2. ✓ Data should still be visible (from database)
3. Close and reopen browser
4. ✓ Data should still be visible (from database)
5. Stop and restart backend: Ctrl+C then npm run dev
6. ✓ Data should still be visible (saved in MongoDB)

---

## 🔧 TROUBLESHOOTING

### Problem: "Cannot connect to backend"
**Solution:**
- Make sure backend is running: `npm run dev` in backend folder
- Check port 5000 is not blocked
- Check MongoDB connection: `node test-complete.js`

### Problem: "Login failed"
**Solution:**
- Make sure admin user exists: `node setup-admin.js`
- Check credentials:
  - Email: `arviorasolution@gmail.com`
  - Password: `Arviora@29`
- Check browser console for error messages (F12)

### Problem: "Data not showing on website"
**Solution:**
- Make sure data is saved in admin panel (you got success message)
- Refresh the page (F5)
- Check backend logs for errors
- Run: `node test-complete.js` to verify API is working

### Problem: "Data disappears on restart"
**Solution:**
✓ This should NOT happen! Data should persist in MongoDB
- If it happens, MongoDB might not be connected
- Run: `node test-complete.js` to check
- Check MongoDB connection status

### Problem: "Image upload failed"
**Solution:**
- Image size must be less than 5MB
- Allowed formats: jpg, jpeg, png, gif, webp
- Make sure you selected an image file

---

## 📞 COMMAND REFERENCE

### Backend Scripts
```powershell
# Start backend in development mode
npm run dev

# Create admin user
node setup-admin.js

# Test login endpoint
node test-login.js

# Test all endpoints
node test-complete.js

# Test API endpoints
node test-api.js
```

### Frontend Commands
```powershell
# Start frontend
npm start

# Build for production
npm run build
```

---

## 🗄️ DATABASE INFO

**Database:** MongoDB Atlas (Cloud)
**URI:** `mongodb+srv://ar6524318_db_user:...@arviora-solutions.syoer4b.mongodb.net/`
**Collections:**
- admins (admin users)
- services (services data)
- blogs (blog posts)
- testimonials (customer testimonials)
- contacts (contact form messages)

---

## 📱 LOGIN CREDENTIALS

**Admin Email:** `arviorasolution@gmail.com`
**Admin Password:** `Arviora@29`

---

## 🌐 USEFUL URLS

- **Website:** http://localhost:3000
- **Admin Login:** http://localhost:3000/login
- **Admin Dashboard:** http://localhost:3000/admin
- **Backend Health:** http://localhost:5000/api/health
- **Services API:** http://localhost:5000/api/services
- **Blogs API:** http://localhost:5000/api/blogs
- **Testimonials API:** http://localhost:5000/api/testimonials

---

## ✨ QUICK TEST

Run this to test everything at once:
```powershell
cd backend
node test-complete.js
```

Expected output:
```
✅ HEALTH CHECK: OK
✅ ADMIN LOGIN: OK
✅ SERVICES: OK
✅ BLOGS: OK
✅ TESTIMONIALS: OK
```

---

**📌 If everything checks out, your system is working correctly!**
**Just make sure both backend and frontend are running together.**
