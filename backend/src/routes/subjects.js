const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/SubjectController');

router.use(authenticate);

router.get('/', ctrl.getSubjects);
router.post('/', authorize('super_admin', 'admin', 'principal', 'dos'), ctrl.createSubject);
router.put('/:id', authorize('super_admin', 'admin', 'principal', 'dos'), ctrl.updateSubject);
router.delete('/:id', authorize('super_admin', 'admin'), ctrl.deleteSubject);

router.post('/allocate', authorize('super_admin', 'admin', 'principal', 'dos'), ctrl.allocateSubject);
router.get('/allocations/all', ctrl.getAllocations);

module.exports = router;
