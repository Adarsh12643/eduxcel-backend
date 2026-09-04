import { Router } from 'express';
import { runPrediction, getStudentPredictions, whatIfSimulation } from '../controllers/predictionController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('student', 'faculty', 'admin'));

router.post('/run', runPrediction);
router.get('/history', getStudentPredictions);
router.post('/what-if', whatIfSimulation);

export default router;
