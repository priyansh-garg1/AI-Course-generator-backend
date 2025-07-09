import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// Enroll in a course
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
      progress: {
        completedTopics: [],
        currentChapter: 0,
        currentTopic: 0,
        lastAccessedAt: new Date()
      }
    });

    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};

// Get user enrollments
export const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const filter = { userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const enrollments = await Enrollment.find(filter)
      .populate('courseId', 'name description category difficulty chapters status')
      .sort({ lastAccessedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Enrollment.countDocuments(filter);

    res.json({
      success: true,
      data: enrollments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
};

// Get enrollment details with progress
export const getEnrollmentDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({ userId, courseId })
      .populate('courseId');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Get course details to calculate total topics
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Calculate total topics and completion percentage
    const totalTopics = course.generatedChapters?.length || 0;
    const completedTopics = enrollment.progress.completedTopics.length;
    const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    res.json({
      success: true,
      data: {
        enrollment,
        progress: {
          completedTopics,
          totalTopics,
          completionPercentage,
          currentChapter: enrollment.progress.currentChapter,
          currentTopic: enrollment.progress.currentTopic
        }
      }
    });
  } catch (error) {
    console.error('Error fetching enrollment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment details',
      error: error.message
    });
  }
};

// Mark topic as completed
export const markTopicCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { chapterOrder, topicIndex } = req.body;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    await enrollment.markTopicCompleted(chapterOrder, topicIndex);

    // Get updated progress
    const course = await Course.findById(courseId);
    const totalTopics = course.generatedChapters?.length || 0;
    const completedTopics = enrollment.progress.completedTopics.length;
    const completionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    res.json({
      success: true,
      message: 'Topic marked as completed',
      data: {
        enrollment,
        progress: {
          completedTopics,
          totalTopics,
          completionPercentage,
          currentChapter: enrollment.progress.currentChapter,
          currentTopic: enrollment.progress.currentTopic
        }
      }
    });
  } catch (error) {
    console.error('Error marking topic completed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark topic as completed',
      error: error.message
    });
  }
};

// Update enrollment status
export const updateEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.status = status;
    if (status === 'completed') {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    res.json({
      success: true,
      message: 'Enrollment status updated',
      data: enrollment
    });
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update enrollment status',
      error: error.message
    });
  }
};

// Unenroll from course
export const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOneAndDelete({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unenroll from course',
      error: error.message
    });
  }
}; 