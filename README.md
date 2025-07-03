# AI Course Generator Backend

A Node.js/Express.js backend with MongoDB integration and JWT authentication for the AI Course Generator application.

## Features

- **User Authentication**: Register, login, and profile management
- **JWT Token Authentication**: Secure token-based authentication
- **MongoDB Integration**: Mongoose ODM for database operations
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Comprehensive error handling middleware
- **Security**: Helmet.js for security headers, CORS configuration
- **Logging**: Morgan for HTTP request logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ai-course-generator
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server:**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication Routes

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "token": "jwt_token"
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "token": "jwt_token"
    }
  }
  ```

#### Get User Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### Update User Profile
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "role": "user",
      "token": "new_jwt_token"
    }
  }
  ```

### Health Check
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "AI Course Generator API is running",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   └── authController.js    # Authentication controller functions
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── errorHandler.js     # Error handling middleware
│   └── validate.js         # Input validation middleware
├── models/
│   └── User.js             # User mongoose model
├── routes/
│   ├── auth.js             # Authentication routes
│   └── index.js            # Main routes index
├── utils/
│   └── generateToken.js    # JWT token generation utility
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
└── env.example             # Environment variables template
```

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configured CORS for frontend integration
- **Error Handling**: Secure error responses without sensitive data

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/ai-course-generator |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT token expiration | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack trace (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Test your changes thoroughly
5. Update documentation if needed # AI-Course-generator-backend
# priAI-Course-generator-backend
