import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("gemini api key", process.env.GEMINI_API_KEY);


export const generateCourseLayout = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate Learning Course depends on following details. In which Make sure to add Course Name, Description, Course Banner Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3d format Chapter Name, Topic under each chapters, Duration for each chapters etc, in JSON format only.

Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ]
      }
    ]
  }
}

User Input: ${userInput}

Please generate a comprehensive course layout based on the user input. Make sure the response is valid JSON that follows the exact schema provided. Include realistic chapter durations, relevant topics for each chapter, and a detailed banner image prompt that matches the course content.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const courseData = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!courseData.course || !courseData.course.chapters) {
      throw new Error('Invalid course structure in AI response');
    }

    return courseData;
  } catch (error) {
    console.error('Error generating course layout:', error);
    throw new Error(`Failed to generate course layout: ${error.message}`);
  }
}; 

export const generateFullCourseContent = async (courseLayout) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Compose the prompt for full course content generation
    const prompt = `Depends on Chapter name and Topic Generate content for each topic in HTML and give response in JSON format.

Schema:
[
  {
    chapterName: <>,
    topics: [
      {
        topic: <>,
        content: <HTML content>
      }
    ]
  }
]

User Input:
${JSON.stringify(courseLayout, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\[([\s\S]*)\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in AI response');
    }

    const chaptersContent = JSON.parse(`[${jsonMatch[1]}]`);
    return chaptersContent;
  } catch (error) {
    console.error('Error generating full course content:', error);
    throw new Error(`Failed to generate full course content: ${error.message}`);
  }
}; 