import { Router } from 'express';
import {
  register,
  login,
  googleLogin,
  getProfile,
  getStreak,
  googleOAuthRedirect,
  googleOAuthCallback,
  onboard,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/google', googleOAuthRedirect);
router.get('/google/callback', googleOAuthCallback);
router.get('/profile', authenticate, getProfile);
router.get('/streak', authenticate, getStreak);
router.put('/onboard', authenticate, onboard);

export default router;
