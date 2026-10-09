# Backend Setup & Quick Start Guide

## 🚀 Quick Start (Local Development)

### 1. Install MongoDB Locally (Optional - for testing without Atlas)

**Windows (using Chocolatey):**
```powershell
choco install mongodb-community
```

**Or using WSL/Docker:**
```bash
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Server will start on: **http://localhost:5000**

### 3. Test API

```bash
# In another terminal, run the test script
node test-api.js
```

---

## 📝 Configuration

### Development (.env) - Local MongoDB
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/arviora_solutions
JWT_SECRET=your_secret_key_here_make_it_long
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Production (.env) - MongoDB Atlas

1. Create MongoDB Atlas account (free tier available)
2. Create cluster and database user
3. Get connection string from Atlas
4. **URL-encode special characters in password**
5. Update `.env`:

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=use_a_strong_random_secret_in_production
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
```

**⚠️ Important:** See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed Atlas setup with password encoding.

---

## 🔑 API Endpoints

### Public Endpoints (No Authentication Required)

```
GET   /api/health                    - Health check
GET   /api/services                  - Get all services
GET   /api/services/:id              - Get service by ID
GET   /api/blogs                     - Get all blogs (paginated)
GET   /api/blogs/:id                 - Get blog by ID
GET   /api/blogs/slug/:slug          - Get blog by slug
GET   /api/testimonials              - Get all testimonials
GET   /api/testimonials/:id          - Get testimonial by ID
POST  /api/contact                   - Submit contact form
POST  /api/auth/register             - Register admin (first time setup)
POST  /api/auth/login                - Admin login
```

### Protected Endpoints (Requires JWT Token)

```
GET   /api/auth/verify               - Verify token
POST  /api/services                  - Create service (Admin)
PUT   /api/services/:id              - Update service (Admin)
DELETE /api/services/:id             - Delete service (Admin)
POST  /api/blogs                     - Create blog (Admin)
PUT   /api/blogs/:id                 - Update blog (Admin)
DELETE /api/blogs/:id                - Delete blog (Admin)
POST  /api/testimonials              - Create testimonial (Admin)
PUT   /api/testimonials/:id          - Update testimonial (Admin)
DELETE /api/testimonials/:id         - Delete testimonial (Admin)
GET   /api/contact                   - Get all contacts (Admin)
GET   /api/contact/:id               - Get contact by ID (Admin)
PUT   /api/contact/:id               - Mark as replied (Admin)
DELETE /api/contact/:id              - Delete contact (Admin)
GET   /api/contact/stats/unread      - Get unread count (Admin)
```

---

## 🧪 Testing Workflow

### Step 1: Register Admin User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Admin registered successfully"
}
```

### Step 2: Login (Get Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }'
```

**Save the token for next steps!**

### Step 3: Create Service (with token)
```bash
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Mobile App Development" \
  -F "description=Custom mobile applications for iOS and Android" \
  -F "price=5000" \
  -F "duration=3-6 weeks" \
  -F "category=mobile" \
  -F "image=@/path/to/image.jpg"
```

### Step 4: Get All Services
```bash
curl http://localhost:5000/api/services
```

### Step 5: Submit Contact Form (Public)
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "Service Inquiry",
    "message": "I am interested in your services"
  }'
```

---

## 📁 File Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── multer.js             # File upload config
├── controllers/              # Admin API business logic
│   ├── authController.js
│   ├── serviceController.js
│   ├── blogController.js
│   ├── testimonialController.js
│   ├── contactController.js
│   └── newsletterController.js
├── middleware/
│   └── authMiddleware.js     # JWT verification
├── middleware/               # Shared error middleware
│   ├── errorHandler.js       # Error handling
│   └── asyncHandler.js       # Async wrapper
├── models/                   # Database schemas
│   ├── Admin.js
│   ├── Service.js
│   ├── Blog.js
│   ├── Testimonial.js
│   ├── Contact.js
│   └── Newsletter.js
├── routes/                   # Admin API routes
│   ├── authRoutes.js
│   ├── serviceRoutes.js
│   ├── blogRoutes.js
│   ├── testimonialRoutes.js
│   ├── contactRoutes.js
│   └── newsletterRoutes.js
├── uploads/                  # Uploaded files (images)
├── server.js                 # Express app entry point
├── test-api.js               # API test script
├── test-db.js                # Database test script
├── package.json
├── .env                      # Environment variables
├── .env.example              # Template
├── .gitignore
├── README.md                 # Full documentation
└── MONGODB_SETUP.md          # MongoDB configuration guide
```

---

## 🛠️ Available Scripts

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Test database connection
node test-db.js

# Test API endpoints
node test-api.js
```

---

## 🔒 Security Checklist

- ✅ Environment variables in `.env` (not committed to git)
- ✅ JWT tokens for authentication
- ✅ Password hashing with bcrypt (salt=10)
- ✅ CORS enabled for frontend domain
- ✅ File upload validation (type & size)
- ✅ Input validation on all endpoints
- ✅ Error middleware (no sensitive info exposed)

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Local: Install MongoDB and ensure it's running
- Atlas: Check credentials in MONGODB_SETUP.md
- Docker: Ensure MongoDB container is running

### Issue: "bad auth: Authentication failed"
**Solution:**
- Check username/password in MongoDB Atlas
- Ensure special characters are URL-encoded (see MONGODB_SETUP.md)
- Verify IP whitelisting in MongoDB Atlas

### Issue: "ENOENT: no such file or directory, open 'uploads'"
**Solution:** 
```bash
mkdir uploads
```

### Issue: Multer file upload errors
**Solution:**
- Check file size (max 5MB)
- Ensure file type is jpg/png/gif/webp
- Check disk space

### Issue: JWT token errors
**Solution:**
- Regenerate token with login
- Ensure token is in correct format: `Authorization: Bearer <token>`
- Check JWT_SECRET in .env

---

## 📚 Frontend Integration

### Connect React to Backend

In your React `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

In your React API service:
```javascript
const API_URL = process.env.REACT_APP_API_URL;

export const apiCall = async (endpoint, method = 'GET', data = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    };
    
    if (data) options.body = JSON.stringify(data);
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return response.json();
};
```

---

## 🚀 Deployment Options

### Option 1: Heroku
```bash
npm install -g heroku-cli
heroku login
heroku create your-app-name
git push heroku main
```

### Option 2: Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Option 3: Render
1. Connect GitHub repository
2. Create new Web Service
3. Set Environment Variables
4. Deploy

### Option 4: DigitalOcean App Platform
1. Connect GitHub
2. Create new app
3. Configure build command: `npm install`
4. Configure start command: `npm start`
5. Add MongoDB connection string in env vars
6. Deploy

---

## 📞 Support & Resources

- **Backend README:** [README.md](./README.md)
- **MongoDB Setup:** [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- **Express Docs:** https://expressjs.com/
- **Mongoose Docs:** https://mongoosejs.com/
- **MongoDB Docs:** https://docs.mongodb.com/

---

## ✅ Setup Checklist

- ✅ Node.js and npm installed
- ✅ MongoDB installed/configured (local or Atlas)
- ✅ Backend folder created
- ✅ Dependencies installed (`npm install`)
- ✅ `.env` file configured
- ✅ Server tested (`npm run dev`)
- ✅ Database connection verified
- ✅ API endpoints tested
- ✅ Frontend configuration updated
- ✅ Ready for frontend integration!

---

Good luck! Your backend is ready! 🎉

**Questions?** Check the README.md or MONGODB_SETUP.md for detailed information.
