import { generateCourseLayout } from '../services/geminiService.js';

export const generateCourse = async (req, res) => {
  try {
    const { userInput } = req.body;

    console.log(userInput);
    

    if (!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User input is required and must be a non-empty string'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key is not configured'
      });
    }

    const courseLayout = await generateCourseLayout(userInput);

    res.json({
      success: true,
      message: 'Course layout generated successfully',
      data: courseLayout
    });
  } catch (error) {
    console.error('Error in course generation controller:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate course layout',
      error: error.message
    });
  }
}; 