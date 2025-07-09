import express from 'express';
import {
  createCourse,
  getCourses,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCourseStatus
} from '../controllers/courseController.js';
import { generateCourse, generateAndSaveFullCourse } from '../controllers/courseGenerationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/explore', getAllCourses);
router.get('/preview/:id', getCourseById); // Public route for course preview
router.post('/generate', generateCourse);

router.post('/generate-full', protect, generateAndSaveFullCourse);
router.use(protect);

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.patch('/:id/status', updateCourseStatus);

export default router; 