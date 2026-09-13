import { Router } from 'express';
import {
  runPrediction,
  getStudentPredictions,
  whatIfSimulation,
  getRecommendations,
  getStudentRecoveryPlan,
} from '../controllers/predictionController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('student', 'faculty', 'admin'));

router.post('/run', runPrediction);
router.get('/history', getStudentPredictions);
router.post('/what-if', whatIfSimulation);
router.post('/recommend', getRecommendations);
router.get('/recovery-plan', getStudentRecoveryPlan);

export default router;
