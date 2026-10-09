# 🚀 API Quick Reference Card

## Base URL
```
http://localhost:5000/api
```

## 🔑 Getting Started

### 1. Register Admin
```
POST /auth/register
{
  "email": "admin@example.com",
  "password": "SecurePassword123"
}
Returns: { success, token, message }
```

### 2. Login (Get Token)
```
POST /auth/login
{
  "email": "admin@example.com",
  "password": "SecurePassword123"
}
Returns: { success, token, message }
```

### 3. Use Token on Protected Routes
```
Authorization: Bearer <YOUR_TOKEN>
```

---

## 📋 API Endpoints

### 🏥 Health Check
```
GET /health
No auth required
Returns: { success, message, timestamp }
```

---

## 👥 Auth Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | No | Register new admin |
| POST | `/auth/login` | No | Login & get token |
| GET | `/auth/verify` | Yes | Verify token validity |

---

## 🛠️ Services API

### Get All Services
```
GET /services?category=web&isActive=true
No auth required
Query Params (optional):
  - category: mobile, web, marketing, design, other
  - isActive: true/false
Returns: { success, services: [] }
```

### Get Service by ID
```
GET /services/:id
No auth required
Returns: { success, service }
```

### Create Service
```
POST /services
Auth: YES (Admin only)
Content-Type: multipart/form-data
Body:
  - title (required): string
  - description (required): string
  - category (required): mobile|web|marketing|design|other
  - price (optional): number
  - duration (optional): string
  - features (optional): array of strings
  - benefits (optional): array of strings
  - image (optional): file (jpg/png/gif/webp, max 5MB)
  - isActive (optional): boolean
Returns: { success, service }
```

### Update Service
```
PUT /services/:id
Auth: YES (Admin only)
Same as create (all fields optional)
Returns: { success, service }
```

### Delete Service
```
DELETE /services/:id
Auth: YES (Admin only)
Returns: { success, message }
```

---

## 📚 Blog API

### Get All Blogs (Paginated)
```
GET /blogs?page=1&limit=10&search=react
No auth required
Query Params (optional):
  - page: number (default: 1)
  - limit: number (default: 10)
  - search: string (searches title & content)
  - category: technology|business|design|marketing|industry|other
  - isPublished: true/false
Returns: { success, blogs: [], total, page, pages }
```

### Get Blog by ID
```
GET /blogs/:id
No auth required
Returns: { success, blog }
(Increments view count automatically)
```

### Get Blog by Slug
```
GET /blogs/slug/:slug
No auth required
Returns: { success, blog }
(Increments view count automatically)
```

### Create Blog
```
POST /blogs
Auth: YES (Admin only)
Content-Type: multipart/form-data
Body:
  - title (required): string
  - content (required): string/HTML
  - category (required): technology|business|design|marketing|industry|other
  - image (optional): file
  - tags (optional): array of strings
  - isPublished (optional): boolean
Returns: { success, blog }
(Slug auto-generated from title)
```

### Update Blog
```
PUT /blogs/:id
Auth: YES (Admin only)
Same as create (all fields optional)
Returns: { success, blog }
```

### Delete Blog
```
DELETE /blogs/:id
Auth: YES (Admin only)
Returns: { success, message }
```

---

## ⭐ Testimonials API

### Get All Testimonials
```
GET /testimonials?isActive=true
No auth required
Query Params (optional):
  - isActive: true/false
Returns: { success, testimonials: [] }
(Sorted by rating - highest first)
```

### Get Testimonial by ID
```
GET /testimonials/:id
No auth required
Returns: { success, testimonial }
```

### Create Testimonial
```
POST /testimonials
Auth: YES (Admin only)
Content-Type: multipart/form-data
Body:
  - name (required): string
  - review (required): string
  - rating (required): 1, 2, 3, 4, or 5
  - company (optional): string
  - position (optional): string
  - image (optional): file
  - isActive (optional): boolean
Returns: { success, testimonial }
```

### Update Testimonial
```
PUT /testimonials/:id
Auth: YES (Admin only)
Same as create (all fields optional)
Returns: { success, testimonial }
```

### Delete Testimonial
```
DELETE /testimonials/:id
Auth: YES (Admin only)
Returns: { success, message }
```

---

## 📧 Contact API

### Submit Contact Form (PUBLIC)
```
POST /contact
No auth required - ANYONE can submit
Body:
  - name (required): string
  - email (required): string (validated)
  - phone (optional): string
  - subject (optional): string
  - message (required): string
Returns: { success, message: "Your message has been sent" }
```

### Get All Contacts
```
GET /contact?isRead=false&page=1&limit=20
Auth: YES (Admin only)
Query Params (optional):
  - isRead: true/false
  - page: number (default: 1)
  - limit: number (default: 20)
Returns: { success, contacts: [], total, pages }
```

### Get Contact by ID
```
GET /contact/:id
Auth: YES (Admin only)
Returns: { success, contact }
(Automatically marks as read)
```

### Mark as Replied
```
PUT /contact/:id
Auth: YES (Admin only)
Returns: { success, contact }
(Sets isReplied: true)
```

### Get Unread Count
```
GET /contact/stats/unread
Auth: YES (Admin only)
Returns: { success, unreadCount: number }
```

### Delete Contact
```
DELETE /contact/:id
Auth: YES (Admin only)
Returns: { success, message }
```

---

## 🔐 Using Authentication

### With cURL
```bash
curl -X GET http://localhost:5000/api/contact \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### With Fetch (JavaScript)
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/contact', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### With Axios (JavaScript)
```javascript
const token = localStorage.getItem('token');
const response = await axios.get('http://localhost:5000/api/contact', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📤 File Upload Example

### With cURL
```bash
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer TOKEN" \
  -F "title=Mobile App" \
  -F "description=Custom mobile development" \
  -F "category=mobile" \
  -F "price=5000" \
  -F "image=@/path/to/image.jpg"
```

### With Fetch (JavaScript)
```javascript
const formData = new FormData();
formData.append('title', 'Mobile App');
formData.append('description', 'Custom mobile development');
formData.append('category', 'mobile');
formData.append('price', 5000);
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/services', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## 🔍 Filtering & Search Examples

### Filter Services by Category
```
GET /api/services?category=web
```

### Filter Active Services
```
GET /api/services?isActive=true
```

### Search Blogs
```
GET /api/blogs?search=react&page=1&limit=10
```

### Filter Published Blogs
```
GET /api/blogs?isPublished=true
```

### Get Unread Contacts
```
GET /api/contact?isRead=false&page=1
```

### Generate an Analytics Report (Admin)
```
GET /api/analytics?from=2026-01-01&to=2026-01-31&metrics=messages,blogs
Authorization: Bearer <admin-token>
```

`from` and `to` are inclusive UTC dates in `YYYY-MM-DD` format. Select one or more comma-separated metrics from `messages`, `blogs`, `services`, and `testimonials`. The date range is limited to 366 days. The response includes daily record counts and summaries (unread messages, published blogs and views, active services, or average testimonial rating) for the selected metrics.

---

## ✅ Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 📊 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK (GET, PUT) |
| 201 | Created (POST) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 404 | Not Found |
| 500 | Server Error |

---

## 🛡️ Important Security Rules

✅ Always use HTTPS in production
✅ Store tokens in httpOnly cookies
✅ Set CORS_ORIGIN to your frontend domain
✅ Change JWT_SECRET in production
✅ Update MongoDB credentials
✅ Never commit .env to git
✅ Validate all input client-side too

---

## 🚨 Common Issues

**"Unauthorized"** → Missing or invalid token
**"Not Found"** → Wrong endpoint or missing ID
**"Bad Request"** → Missing required fields
**"File too large"** → Image exceeds 5MB limit
**"Invalid file type"** → Only jpg/png/gif/webp allowed

---

## 📝 Example: Complete Workflow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"pass123"}'

# Get token from response

# 2. Create service
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Web Dev","description":"...","category":"web"}'

# 3. Get all services
curl http://localhost:5000/api/services

# 4. Submit contact (public)
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"..."}'

# 5. View contact (admin)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/contact
```

---

**Quick Links:**
- Full Docs: README.md
- Setup Guide: BACKEND_SETUP.md
- MongoDB Setup: MONGODB_SETUP.md
- Test Script: test-api.js

---

**Backend API Ready to Use!** 🎉
