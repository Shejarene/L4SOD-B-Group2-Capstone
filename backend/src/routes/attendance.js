const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/AttendanceController');

router.use(authenticate);

router.get('/', ctrl.getAttendance);
router.post('/', authorize('teacher', 'admin', 'principal'), ctrl.markAttendance);
router.get('/report', authorize('teacher', 'admin', 'principal', 'dos'), ctrl.getAttendanceReport);

module.exports = router;
