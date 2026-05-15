const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/DashboardController');

router.use(authenticate);

router.get('/admin', authorize('super_admin', 'admin', 'principal'), ctrl.getAdminDashboard);
router.get('/teacher', authorize('teacher'), ctrl.getTeacherDashboard);
router.get('/student', authorize('student'), ctrl.getStudentDashboard);
router.get('/parent', authorize('parent'), ctrl.getParentDashboard);

module.exports = router;
