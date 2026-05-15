const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/ExamController');

router.use(authenticate);

router.get('/', ctrl.getExams);
router.post('/', authorize('super_admin', 'admin', 'principal', 'dos'), ctrl.createExam);
router.put('/:id', authorize('super_admin', 'admin', 'principal', 'dos'), ctrl.updateExam);
router.delete('/:id', authorize('super_admin', 'admin'), ctrl.deleteExam);

module.exports = router;
