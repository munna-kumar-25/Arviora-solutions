# MongoDB Setup Guide for Arviora Solutions Backend

This guide will help you set up MongoDB connection for your backend.

## Option 1: MongoDB Atlas (Cloud - Recommended for Production)

### Step 1: Create MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Register** and create a free account
3. Verify your email

### Step 2: Create a Cluster
1. Click **Create** a new project
2. Click **Build a Cluster**
3. Select **Shared** (Free tier)
4. Choose your region (closest to your users)
5. Click **Create Cluster** (wait 5-10 minutes)

### Step 3: Create Database User
1. Go to **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Enter username: `arviorasolutions` (or your choice)
4. Enter password (save it, you'll need it!)
   - **⚠️ IMPORTANT:** If password contains `@`, it must be URL-encoded as `%40`
   - If password contains other special characters:
     - `!` → `%21`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`
     - `&` → `%26`
     - `'` → `%27`
     - etc.
4. Set **Database User Privileges** to `readWriteAnyDatabase`
5. Click **Add User**

### Step 4: Setup Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **ALLOW ACCESS FROM ANYWHERE** (for development)
   - For production, restrict to your server IP
3. Click **Confirm**

### Step 5: Get Connection String
1. Go to **Clusters** → Click **Connect**
2. Select **Drivers** → **Node.js**
3. Copy the connection string
4. Replace `<password>` with your actual password (URL-encoded if needed)
5. Replace `<username>` with your username
6. Paste into `.env` as `MONGO_URI`

**Example:**
```
MONGO_URI=mongodb+srv://arviorasolutions:password%4029@cluster0.mongodb.net/?appName=Arviorasolutions
```

### Step 6: Test Connection
```bash
npm run dev
# Server should show "✅ MongoDB Connected"
```

---

## Option 2: Local MongoDB (For Development)

### Windows Installation

#### Using MongoDB Community Server
1. Download from [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Run installer with default settings
3. MongoDB will be installed as a service

#### Using Chocolatey (Easier)
```powershell
choco install mongodb-community --version=7.0.0
```

#### Connection String
Add to `.env`:
```
MONGO_URI=mongodb://localhost:27017/arviora_solutions
```

### macOS Installation

#### Using Homebrew
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Connection String
Add to `.env`:
```
MONGO_URI=mongodb://localhost:27017/arviora_solutions
```

### Linux (Ubuntu) Installation

```bash
# Import the MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Connection String
Add to `.env`:
```
MONGO_URI=mongodb://localhost:27017/arviora_solutions
```

### Using Docker

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

#### Connection String
```
MONGO_URI=mongodb://admin:password@localhost:27017/arviora_solutions?authSource=admin
```

---

## URL Encoding Special Characters

If your MongoDB password contains special characters, they must be URL-encoded:

| Character | URL Encoded |
|-----------|-------------|
| @         | %40         |
| !         | %21         |
| #         | %23         |
| $         | %24         |
| %         | %25         |
| &         | %26         |
| '         | %27         |
| (         | %28         |
| )         | %29         |
| *         | %2A         |
| +         | %2B         |
| ,         | %2C         |
| /         | %2F         |
| :         | %3A         |
| ;         | %3B         |
| =         | %3D         |
| ?         | %3F         |
| @         | %40         |
| [         | %5B         |
| ]         | %5D         |

**Example:** Password `pass@word!123` becomes `pass%40word%21123`

---

## Troubleshooting

### "bad auth: Authentication failed"
- ❌ Wrong username or password
- ✅ Solution: Check credentials in MongoDB Atlas
- ✅ Solution: Ensure special characters are URL-encoded

### "URI must include hostname, domain name, and tld"
- ❌ MongoDB URI format is invalid
- ✅ Solution: Use correct format: `mongodb+srv://username:password@hostname/?appName=name`
- ✅ Solution: URL-encode special characters in password

### "getaddrinfo EAI_AGAIN"
- ❌ Network connectivity issue
- ✅ Solution: Check internet connection
- ✅ Solution: In MongoDB Atlas, ensure your IP is whitelisted

### "Operation timed out"
- ❌ Server taking too long to connect
- ✅ Solution: Check network latency
- ✅ Solution: Try connecting to a closer region in MongoDB Atlas

### "Cannot connect to local MongoDB"
- ❌ MongoDB service not running
- ✅ Solution (Windows): Check Services app for "MongoDB Server"
- ✅ Solution (Mac): Run `brew services start mongodb-community`
- ✅ Solution (Linux): Run `sudo systemctl start mongod`

---

## Testing Your Connection

### Using the Test Script
```bash
npm run test-db
```

### Using MongoDB Shell

#### Connect to Local MongoDB
```bash
mongosh
```

#### Connect to MongoDB Atlas
```bash
mongosh "mongodb+srv://username:password@cluster0.mongodb.net/database_name"
```

#### Basic Commands
```javascript
// Show all databases
show databases

// Use a database
use arviora_solutions

// Show collections
show collections

// Insert test data
db.services.insertOne({
    title: "Test Service",
    description: "This is a test",
    isActive: true
})

// Query data
db.services.find()

// Delete test data
db.services.deleteMany({})
```

---

## Environment Setup Checklist

- ✅ MongoDB account created (Atlas) or locally installed
- ✅ Database user created with proper permissions
- ✅ Network/IP whitelisted (for Atlas)
- ✅ Connection string obtained
- ✅ Special characters URL-encoded
- ✅ `.env` file updated with `MONGO_URI`
- ✅ Backend server started successfully
- ✅ Database connection test passed

---

## Database Schema

When you first connect, Mongoose will automatically create these collections:

```
arviora_solutions/
├── admins/
├── services/
├── blogs/
├── testimonials/
└── contacts/
```

All collections include automatic `createdAt` and `updatedAt` timestamps.

---

## Security Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix uppercase, lowercase, numbers, special characters
   - Never use common words or patterns

2. **Rotate Credentials**
   - Change database password every 90 days
   - Use different credentials per environment

3. **IP Whitelisting**
   - In MongoDB Atlas, restrict to specific IPs
   - In production, whitelist only your server IP

4. **Environment Variables**
   - Never commit `.env` to git
   - Use `.env.example` as template
   - Load `.env` from secure location in production

5. **Regular Backups**
   - Enable automated backups in MongoDB Atlas
   - Test restore procedure regularly
   - Keep backups encrypted

---

## Support

For more help:
- MongoDB Atlas Support: https://www.mongodb.com/support
- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/

---

**Last Updated:** 2024  
**Version:** 1.0.0
