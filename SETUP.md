# Backend Setup Guide

This guide will help you set up the AI Course Generator backend with Express.js and MongoDB.

## Prerequisites

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **MongoDB** (Choose one option)

   **Option A: Local MongoDB**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Install and start MongoDB service
   - Verify: `mongod --version`

   **Option B: MongoDB Atlas (Cloud)**
   - Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

   **Option C: Docker**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## Quick Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp env.example .env
   ```

3. **Edit .env file**
   ```env
   PORT=5000
   NODE_ENV=development
   
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017/ai-course-generator
   
   # For MongoDB Atlas (replace with your connection string)
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-course-generator
   
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

5. **Test Setup**
   ```bash
   node test-setup.js
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Testing

Once the server is running, you can test the API endpoints:

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

## Troubleshooting

### MongoDB Connection Issues

1. **"ECONNREFUSED" Error**
   - Make sure MongoDB is running
   - Check if the port 27017 is available
   - Verify your MONGODB_URI in .env file

2. **Authentication Error**
   - If using MongoDB Atlas, ensure your IP is whitelisted
   - Check username/password in connection string
   - Verify database name is correct

### Port Already in Use

If port 5000 is already in use:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env file
PORT=5001
```

### JWT Secret Issues

Make sure to set a strong JWT_SECRET:
```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Development Workflow

1. **Start MongoDB** (if local)
2. **Start backend**: `npm run dev`
3. **Start frontend**: `cd ../frontend && npm run dev`
4. **Test API endpoints** using curl, Postman, or your frontend

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure MongoDB Atlas or production MongoDB instance
4. Set up proper CORS origins
5. Use environment variables for all sensitive data

## Next Steps

After successful setup:

1. Test all API endpoints
2. Connect frontend to backend
3. Implement additional features (courses, AI integration, etc.)
4. Add comprehensive error handling
5. Set up automated testing 