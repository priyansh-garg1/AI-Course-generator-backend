# Gemini AI Setup Guide

## Getting Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Copy the generated API key

3. **Configure Environment**
   - Create a `.env` file in the backend directory (if it doesn't exist)
   - Add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Example .env file:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-course-generator
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=AIzaSyC...your_actual_key_here
```

## Testing the Setup
1. Restart your backend server after adding the API key
2. Try creating a course in the frontend
3. The AI generation should work without errors

## Troubleshooting
- Make sure the API key is valid and not expired
- Check that the .env file is in the correct location (backend directory)
- Ensure the server is restarted after adding the API key
- Verify the API key format (should start with "AIzaSy") 