import { Router } from 'express';
import { generateChatReply } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, generateChatReply);

export default router;

