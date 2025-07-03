import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { 
  validateRegister, 
  validateLogin, 
  validateProfileUpdate 
} from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validateProfileUpdate, updateUserProfile);

export default router; 