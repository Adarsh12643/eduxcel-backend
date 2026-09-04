import { Router } from 'express';
import {
  getAdminOverview,
  getAllUsers,
  getSystemStats,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.get('/stats', getSystemStats);

export default router;
