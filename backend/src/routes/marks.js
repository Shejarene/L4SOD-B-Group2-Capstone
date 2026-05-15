const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/MarksController');

const auditLog = require('../middleware/audit');

router.use(authenticate);

router.get('/', ctrl.getMarks);
router.post('/', authorize('teacher', 'dos'), auditLog('ENTER_MARK', 'Mark'), ctrl.enterMark);
router.post('/batch', authorize('teacher', 'dos'), auditLog('BATCH_ENTER_MARK', 'Mark'), ctrl.batchEnterMarks);
router.post('/submit', authorize('teacher'), auditLog('SUBMIT_MARK', 'Mark'), ctrl.submitMarks);
router.post('/approve', authorize('dos', 'admin', 'principal'), auditLog('APPROVE_MARK', 'Mark'), ctrl.approveMarks);
router.post('/reject', authorize('dos', 'admin', 'principal'), auditLog('REJECT_MARK', 'Mark'), ctrl.rejectMarks);

module.exports = router;
