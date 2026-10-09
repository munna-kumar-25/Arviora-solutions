# Arviora Solutions - Backend API

Production-ready Node.js/Express/MongoDB backend for the Arviora Solutions service-based website with React frontend integration.

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (Atlas or local)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

Server runs on `http://localhost:5000` by default.

## 🔧 Configuration

Create a `.env` file in the backend root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (MongoDB)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?appName=YourApp

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
```

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── multer.js             # File upload config
├── controllers/              # Admin API handlers
│   ├── authController.js     # Authentication
│   ├── serviceController.js  # Services CRUD
│   ├── blogController.js     # Blog CRUD
│   ├── testimonialController.js
│   ├── contactController.js
│   └── newsletterController.js
├── middleware/
│   └── authMiddleware.js     # JWT verification
├── middleware/
│   ├── errorHandler.js       # Error handling
│   └── asyncHandler.js       # Async wrapper
├── models/                   # Admin data models
│   ├── Admin.js              # Admin schema
│   ├── Service.js            # Service schema
│   ├── Blog.js               # Blog schema
│   ├── Testimonial.js        # Testimonial schema
│   ├── Contact.js            # Contact schema
│   └── Newsletter.js
├── routes/                   # Admin API routes
│   ├── authRoutes.js
│   ├── serviceRoutes.js
│   ├── blogRoutes.js
│   ├── testimonialRoutes.js
│   ├── contactRoutes.js
│   └── newsletterRoutes.js
├── uploads/                  # User uploaded files
├── .env                      # Environment variables
├── .env.example              # Example config
├── .gitignore                # Git ignore rules
├── server.js                 # Express app entry point
└── package.json              # Dependencies

```

## 📚 API Documentation

The Admin Panel's API routes, controllers, models, authentication middleware, and request validators are part of this same backend.

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register Admin
- **POST** `/auth/register`
- **Body:** `{ email, password }`
- **Response:** `{ success, token, admin }`

#### Login
- **POST** `/auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ success, token, admin }`

#### Verify Token
- **GET** `/auth/verify`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, admin }`

---

### Services Endpoints

#### Get All Services
- **GET** `/services`
- **Query Params:** `?category=web&isActive=true`
- **Response:** `{ success, services: [] }`

#### Get Service by ID
- **GET** `/services/:id`
- **Response:** `{ success, service }`

#### Create Service (Admin Only)
- **POST** `/services`
- **Headers:** `Authorization: Bearer <token>`
- **Body (FormData):**
  - `title` (string, required)
  - `description` (string, required)
  - `image` (file)
  - `icon` (string)
  - `price` (number)
  - `duration` (string)
  - `features` (array of strings)
  - `benefits` (array of strings)
  - `category` (enum: mobile, web, marketing, design, other)
  - `isActive` (boolean)
- **Response:** `{ success, service }`

#### Update Service (Admin Only)
- **PUT** `/services/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same as create (all fields optional)
- **Response:** `{ success, service }`

#### Delete Service (Admin Only)
- **DELETE** `/services/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, message }`

---

### Blog Endpoints

#### Get All Blogs (with Pagination)
- **GET** `/blogs?page=1&limit=10&search=react&category=technology`
- **Query Params:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `search` (searches title and content)
  - `category` (filter by category)
  - `isPublished` (true/false)
- **Response:** `{ success, blogs: [], total, page, pages }`

#### Get Blog by ID
- **GET** `/blogs/:id`
- **Response:** `{ success, blog }` (increments view count)

#### Get Blog by Slug
- **GET** `/blogs/slug/:slug`
- **Response:** `{ success, blog }` (increments view count)

#### Create Blog (Admin Only)
- **POST** `/blogs`
- **Headers:** `Authorization: Bearer <token>`
- **Body (FormData):**
  - `title` (string, required)
  - `content` (string/HTML, required)
  - `image` (file)
  - `category` (enum: technology, business, design, marketing, industry, other)
  - `tags` (array of strings)
  - `isPublished` (boolean)
- **Response:** `{ success, blog }` (slug auto-generated)

#### Update Blog (Admin Only)
- **PUT** `/blogs/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same as create (all fields optional)
- **Response:** `{ success, blog }`

#### Delete Blog (Admin Only)
- **DELETE** `/blogs/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, message }`

---

### Testimonials Endpoints

#### Get All Testimonials
- **GET** `/testimonials`
- **Query Params:** `?isActive=true`
- **Response:** `{ success, testimonials: [] }`

#### Get Testimonial by ID
- **GET** `/testimonials/:id`
- **Response:** `{ success, testimonial }`

#### Create Testimonial (Admin Only)
- **POST** `/testimonials`
- **Headers:** `Authorization: Bearer <token>`
- **Body (FormData):**
  - `name` (string, required)
  - `review` (string, required)
  - `rating` (number 1-5, required)
  - `image` (file)
  - `company` (string)
  - `position` (string)
  - `isActive` (boolean)
- **Response:** `{ success, testimonial }`

#### Update Testimonial (Admin Only)
- **PUT** `/testimonials/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same as create (all fields optional)
- **Response:** `{ success, testimonial }`

#### Delete Testimonial (Admin Only)
- **DELETE** `/testimonials/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, message }`

---

### Contact Endpoints

#### Submit Contact Form (Public)
- **POST** `/contact`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "Inquiry",
    "message": "Your message here"
  }
  ```
- **Response:** `{ success, message: "Your message has been sent successfully" }`

#### Get All Contacts (Admin Only)
- **GET** `/contact`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `?isRead=false&page=1&limit=20`
- **Response:** `{ success, contacts: [], total, pages }`

#### Get Contact by ID (Admin Only)
- **GET** `/contact/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, contact }` (marks as read)

#### Mark Contact as Replied (Admin Only)
- **PUT** `/contact/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, contact }`

#### Get Unread Count (Admin Only)
- **GET** `/contact/stats/unread`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, unreadCount }`

#### Delete Contact (Admin Only)
- **DELETE** `/contact/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success, message }`

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Using bcryptjs with salt round 10
- **CORS Enabled** - Restricted to frontend domains
- **Input Validation** - Using Joi and Mongoose validation
- **Error Handling** - Comprehensive error middleware
- **Rate Limiting** - Ready for implementation
- **File Upload Validation** - Type and size restrictions

## 📦 Dependencies

### Production
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **joi** - Data validation
- **express-async-errors** - Async error handling
- **mongoose-paginate-v2** - Pagination support

### Development
- **nodemon** - Auto-reload during development

## 🚀 Deployment

### Environment Variables
Update `.env` for production:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret_change_this
FRONTEND_URL=https://yourdomain.com
```

### Deploy on Heroku
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

### Deploy on AWS/Azure/DigitalOcean
- Set environment variables in hosting platform
- Use `npm start` as start command
- Ensure MongoDB connection string is accessible from deployment region

## 🧪 Testing

### Test with cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get all services
curl http://localhost:5000/api/services

# Create service (need token)
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Mobile App" \
  -F "description=Custom mobile applications" \
  -F "image=@/path/to/image.jpg"
```

### Test with Postman
Import the API collection from documentation. All endpoints are documented with examples.

## 📝 Database Models

### Admin
```javascript
{
  email: String (unique, required),
  password: String (min 6, hashed),
  role: String (admin, superadmin),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Service
```javascript
{
  title: String (unique, required),
  description: String (required),
  icon: String,
  image: String,
  price: Number,
  duration: String,
  features: [String],
  benefits: [String],
  category: String (enum),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Blog
```javascript
{
  title: String (unique, required),
  slug: String (unique, auto-generated),
  content: String (required, HTML),
  image: String,
  category: String (enum),
  tags: [String],
  author: String (default: "Arviora Solution"),
  views: Number (default: 0),
  isPublished: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Testimonial
```javascript
{
  name: String (required),
  company: String,
  review: String (required),
  rating: Number (1-5, required),
  image: String,
  position: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact
```javascript
{
  name: String (required),
  email: String (required, validated),
  phone: String,
  subject: String,
  message: String (required),
  isRead: Boolean (default: false),
  isReplied: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure internet connection

### JWT Token Expired
- Re-login to get a new token
- Token expires in 7 days by default

### File Upload Not Working
- Check file size (max 5MB)
- Verify file type (jpg, png, gif, webp)
- Ensure `/uploads` directory exists

### CORS Error
- Update `FRONTEND_URL` in `.env`
- Verify frontend is sending correct credentials

## 📞 Support

For issues or questions:
- Check the API documentation above
- Review error messages in server logs
- Check MongoDB Atlas logs for database errors

## 📄 License

Arviora Solutions - All rights reserved

---

**Last Updated:** 2024
**Version:** 1.0.0
