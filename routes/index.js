import express from 'express';
import authRoutes from './auth.js';
import courseRoutes from './courses.js';
import enrollmentRoutes from './enrollments.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Course Generator API is running',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);

export default router; 