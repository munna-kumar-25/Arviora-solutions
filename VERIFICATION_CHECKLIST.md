# ✅ VERIFICATION CHECKLIST

## Step 1: Backend Running
```
Open Terminal 1
cd backend
npm run dev
```
- [ ] See: `✅ Server running on port 5000`
- [ ] See: `✅ MongoDB Connected`
- [ ] No red error messages
- [ ] Nodemon watching files

**If Failed:** 
```powershell
# Check .env file exists in backend/
# Check MONGODB_URI and JWT_SECRET are set
# Run: npm install
# Then: npm run dev
```

---

## Step 2: Frontend Running
```
Open Terminal 2 (keep Terminal 1 running)
cd frontend
npm start
```
- [ ] Browser opens at http://localhost:3000
- [ ] See white/purple Arviora themes
- [ ] No red error messages
- [ ] Homepage loads

**If Failed:**
```powershell
# Check frontend/package.json exists
# Run: npm install
# Then: npm start
```

---

## Step 3: Admin Login
```
1. Go to http://localhost:3000/login
2. Enter:
   Email: arviorasolution@gmail.com
   Password: Arviora@29
3. Click: LOGIN
```
- [ ] Redirects to /admin/dashboard
- [ ] See: Dashboard, Services, Blogs, Testimonials menu
- [ ] No error messages
- [ ] Can see existing data

**If Failed:**
```powershell
# Terminal 1 (backend): Check logs for auth errors
# Check admin credentials in MongoDB:
# db.admins.findOne()
# Should have username: arviorasolution@gmail.com

# If missing, run:
# node setup-admin.js
```

---

## Step 4: Add New Service
```
1. In admin: Click "Services" → "Add New"
2. Fill form:
   - Name: Test Service
   - Description: Test Description
   - Upload image
3. Click: SAVE
```
- [ ] Success message appears
- [ ] Redirected to Services list
- [ ] New service visible in list
- [ ] Image shows in list

**If Failed:**
```powershell
# Terminal 1: Check API logs
# Check /uploads folder exists in backend
# Check image was uploaded (in backend/uploads/)
```

---

## Step 5: See on Website
```
1. Go to http://localhost:3000 (home)
2. Scroll to Services section
3. Look for "Test Service"
```
- [ ] Test Service shows on homepage
- [ ] Image displays
- [ ] Description visible
- [ ] Card looks good

**If Failed:**
```powershell
# Terminal 1: Check API response
# In frontend Terminal 2: Check browser console (F12)
# Check AppContext is fetching data
```

---

## Step 6: Data Persistence
```
1. Refresh page (F5)
```
- [ ] Test Service STILL shows
- [ ] Image STILL displays
- [ ] No data disappeared

**If Failed:**
This indicates MongoDB is not saving properly.

---

## Step 7: Backend Restart
```
1. Terminal 1: Press Ctrl+C
2. Wait for terminal to close
3. Run: npm run dev
4. Wait for ✅ MongoDB Connected
```
- [ ] Backend restarts successfully
- [ ] Still shows: ✅ Server running on port 5000
- [ ] Frontend still running (Terminal 2)

---

## Step 8: Data Still There?
```
1. Go to http://localhost:3000
2. Scroll to Services section
```
- [ ] Test Service STILL shows
- [ ] Data persisted across restart ✓

**If Failed:**
MongoDB connection may be dropping. Check:
```powershell
# Terminal 1: Check for connection errors
# Check internet connection (MongoDB is cloud-based)
# Run: node test-complete.js
```

---

## 🎯 All Checks Passed?
Your system is **FULLY WORKING**! 🎉

You can now:
- Add/Edit/Delete Services
- Add/Edit/Delete Blogs  
- Add/Edit/Delete Testimonials
- Upload images
- See everything on website
- Data persists forever

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "Cannot GET /api/..." | Backend not running (Terminal 1) |
| "MongoDB Connected ❌" | Check internet, check MONGODB_URI in .env |
| "Login failed" | Run `node setup-admin.js` in backend |
| "Image not showing" | Check backend/uploads/ folder exists |
| "Data disappeared" | Check MongoDB connection (Terminal 1 logs) |
| "JSX error in browser" | Frontend needs reload (F5) + backend restart |
| "Port 3000 already in use" | `netstat -ano \| findstr :3000` then kill process |
| "Port 5000 already in use" | `netstat -ano \| findstr :5000` then kill process |

