import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

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

    const prompt = `Generate detailed HTML-based educational content for each topic under every chapter from the provided course layout.

Return response in valid JSON format only:
[
  {
    "chapterName": "string",
    "topics": [
      {
        "topic": "string",
        "content": "<HTML content>"
      }
    ]
  }
]

Respond ONLY with a clean JSON array. Do not include markdown or extra text.

User Input:
${JSON.stringify(courseLayout, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text(); // ✅ FIXED

    const jsonMatch = text.match(/\[([\s\S]*)\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in AI response');
    }

    const cleaned = `[${jsonMatch[1].replace(/[\x00-\x1F\x7F]/g, '')}]`;

    const chaptersContent = JSON.parse(cleaned);
    return chaptersContent;
  } catch (error) {
    console.error('Error generating full course content:', error);
    throw new Error(`Failed to generate full course content: ${error.message}`);
  }
};


export const fetchYouTubeVideos = async (query, maxResults = 1) => {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new Error('YouTube API key not configured');
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const params = {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults,
      key: apiKey,
      safeSearch: 'strict',
      videoEmbeddable: 'true',
    };
    const response = await axios.get(url, { params });
    if (response.data && response.data.items && response.data.items.length > 0) {
      return response.data.items.map(item => `https://www.youtube.com/watch?v=${item.id.videoId}`);
    }
    return [];
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
}; 