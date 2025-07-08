import { generateCourseLayout } from '../services/geminiService.js';
import { generateFullCourseContent } from '../services/geminiService.js';
import Course from '../models/Course.js';

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

export const generateAndSaveFullCourse = async (req, res) => {
  try {
    const { courseLayout } = req.body;
    if (!courseLayout || typeof courseLayout !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Course layout is required and must be an object.'
      });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required.'
      });
    }

    // Generate full course content using Gemini
    const chaptersContent = await generateFullCourseContent(courseLayout);

    // Prepare course data for MongoDB
    const courseData = {
      name: courseLayout.name || courseLayout.course?.name,
      description: courseLayout.description || courseLayout.course?.description,
      chapters: courseLayout.noOfChapters || courseLayout.course?.noOfChapters || courseLayout.chapters?.length || courseLayout.course?.chapters?.length,
      includeVideos: courseLayout.includeVideos || courseLayout.course?.includeVideos,
      category: courseLayout.category || courseLayout.course?.category,
      difficulty: courseLayout.difficulty || courseLayout.course?.difficulty || courseLayout.level || courseLayout.course?.level,
      level: courseLayout.level || courseLayout.course?.level,
      bannerImagePrompt: courseLayout.bannerImagePrompt || courseLayout.course?.bannerImagePrompt,
      aiGeneratedLayout: courseLayout,
      generatedChapters: [],
      createdBy: req.user.id,
      status: 'published',
    };

    // Map chaptersContent to generatedChapters
    if (Array.isArray(chaptersContent)) {
      chaptersContent.forEach((chapter, idx) => {
        if (chapter.topics && Array.isArray(chapter.topics)) {
          chapter.topics.forEach((topicObj, tIdx) => {
            courseData.generatedChapters.push({
              title: chapter.chapterName,
              description: topicObj.topic,
              objectives: [],
              videoKeywords: '',
              order: idx + 1,
              content: topicObj.content
            });
          });
        }
      });
    }

    // Save the course
    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Full course generated and saved successfully',
      data: course
    });
  } catch (error) {
    console.error('Error generating and saving full course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate and save full course',
      error: error.message
    });
  }
}; 