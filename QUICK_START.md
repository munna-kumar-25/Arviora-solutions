# ⚡ QUICK START - 5 MINUTE SETUP

## 🎯 DO THIS EXACTLY (in order):

### Terminal 1: Backend
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\backend"
npm run dev
```
**WAIT** until you see:
- `✅ Server running on port 5000`
- `✅ MongoDB Connected`

---

### Terminal 2: Frontend (NEW terminal, keep backend running)
```powershell
cd "c:\Users\Alfa\Desktop\Arviora Solution\frontend"
npm start
```
**WAIT** until you see browser open at: http://localhost:3000

---

### Now You Can:

1. **Go to Login:**
   - http://localhost:3000/login
   - Email: `arviorasolution@gmail.com`
   - Password: `Arviora@29`
   - Click: **Login**

2. **Add Services/Blogs/Testimonials:**
   - Click menu: Services / Blogs / Testimonials
   - Add New
   - Fill form + upload image
   - Click: Save ✓

3. **View on Website:**
   - Go to: http://localhost:3000
   - Scroll down
   - Should see your data ✓

4. **Test Data Persistence:**
   - Refresh page (F5) → Data stays ✓
   - Close browser → Data stays ✓
   - Restart backend → Data stays ✓

---

## ✅ EXPECTED RESULTS

✓ Login works
✓ Can add services/blogs/testimonials
✓ Data shows on website
✓ Data persists after refresh/restart

---

## ⚠️ IF NOT WORKING

### "Cannot connect to backend"
```powershell
# Check backend in terminal 1
# Must show: ✅ MongoDB Connected
# Must show: ✅ Server running on port 5000
```

### "Login failed"
```powershell
# Create admin user:
cd backend
node setup-admin.js

# Then try login again with:
# Email: arviorasolution@gmail.com
# Password: Arviora@29
```

### "Data not showing"
```powershell
# Check backend is running (Terminal 1)
# Refresh page (F5)
# Check browser console (F12) for errors
```

### "Data disappears after restart"
This should NOT happen! If it does:
```powershell
cd backend
node test-complete.js
# Check if MongoDB Connected: ✅
```

---

**IF ALL TERMINALS START WITHOUT ERRORS, YOUR SYSTEM IS WORKING! 🎉**
