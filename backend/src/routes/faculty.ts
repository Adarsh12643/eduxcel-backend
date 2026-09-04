import { Router } from 'express';
import {
  getFacultyDashboard,
  getAllStudents,
  getStudentDetail,
  updateStudentMarks,
  updateAttendance,
  getClassAnalytics,
  createAssignment,
  getAssignments,
} from '../controllers/facultyController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('faculty', 'admin'));

router.get('/dashboard', getFacultyDashboard);
router.get('/students', getAllStudents);
router.get('/students/:id', getStudentDetail);
router.post('/students/:id/marks', updateStudentMarks);
router.post('/students/:id/attendance', updateAttendance);
router.get('/analytics', getClassAnalytics);
router.post('/assignments', createAssignment);
router.get('/assignments', getAssignments);

export default router;
