import express from 'express';
import {
  registerUser,
  verifyOtp,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { registerValidator } from '../utils/validators/userValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
// Add input validation middleware here if needed

const router = express.Router();

router.post('/register', registerValidator, registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Routes for forgotPassword and resetPassword would go here

export default router;