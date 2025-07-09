import express from 'express';
import {
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentDetails,
  markTopicCompleted,
  updateEnrollmentStatus,
  unenrollFromCourse
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All enrollment routes require authentication
router.use(protect);

// Enrollment management
router.post('/', enrollInCourse);
router.get('/', getUserEnrollments);
router.get('/:courseId', getEnrollmentDetails);
router.delete('/:courseId', unenrollFromCourse);

// Progress tracking
router.post('/:courseId/progress', markTopicCompleted);
router.patch('/:courseId/status', updateEnrollmentStatus);

export default router; 