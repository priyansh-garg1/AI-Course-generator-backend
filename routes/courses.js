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
import { generateCourse } from '../controllers/courseGenerationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/explore', getAllCourses);
router.post('/generate', generateCourse);

router.use(protect);

router.post('/', createCourse);
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.patch('/:id/status', updateCourseStatus);

export default router; 