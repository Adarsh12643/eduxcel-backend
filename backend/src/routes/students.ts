import { Router } from 'express';
import {
  getStudentDashboard,
  getStudentSubjects,
  getStudentAssignments,
  getStudentHistory,
  getRecoveryPlan,
} from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('student'));

router.get('/dashboard', getStudentDashboard);
router.get('/subjects', getStudentSubjects);
router.get('/assignments', getStudentAssignments);
router.get('/history', getStudentHistory);
router.get('/recovery', getRecoveryPlan);

export default router;
