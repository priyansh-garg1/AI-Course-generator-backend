import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Course Generator API is running',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);

export default router; 