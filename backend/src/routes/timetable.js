const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/TimetableController');

router.use(authenticate);

router.get('/', ctrl.getTimetable);
router.post('/', authorize('admin', 'principal', 'dos'), ctrl.createEntry);
router.put('/:id', authorize('admin', 'principal', 'dos'), ctrl.updateEntry);
router.delete('/:id', authorize('admin', 'principal'), ctrl.deleteEntry);

module.exports = router;
