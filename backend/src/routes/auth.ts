import { Router } from 'express';
import { register, login, googleLogin, getProfile, googleOAuthRedirect, googleOAuthCallback } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/google', googleOAuthRedirect);
router.get('/google/callback', googleOAuthCallback);
router.get('/profile', authenticate, getProfile);

export default router;
