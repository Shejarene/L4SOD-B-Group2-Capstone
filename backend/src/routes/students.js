const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/StudentController');

router.use(authenticate);

router.get('/', authorize('super_admin', 'admin', 'principal', 'dos', 'teacher'), ctrl.getStudents);
router.get('/:id', authorize('super_admin', 'admin', 'principal', 'dos', 'teacher', 'parent'), ctrl.getStudentById);
router.put('/:id', authorize('super_admin', 'admin'), ctrl.updateStudent);
router.post('/:id/link-parent', authorize('super_admin', 'admin'), ctrl.linkParent);
router.get('/:id/performance', authorize('super_admin', 'admin', 'dos', 'teacher', 'parent', 'student'), ctrl.getStudentPerformance);

module.exports = router;
