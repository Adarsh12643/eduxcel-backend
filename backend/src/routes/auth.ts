import { Router } from 'express';
import { register, login, googleLogin, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/profile', authenticate, getProfile);

export default router;
