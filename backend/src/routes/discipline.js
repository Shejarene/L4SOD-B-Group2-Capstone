const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/DisciplineController');

router.use(authenticate);

router.get('/', ctrl.getRecords);
router.post('/', authorize('discipline_master', 'admin', 'principal'), ctrl.createRecord);
router.put('/:id', authorize('discipline_master', 'admin', 'principal'), ctrl.updateRecord);
router.patch('/:id/resolve', authorize('discipline_master', 'admin', 'principal'), ctrl.resolveRecord);

module.exports = router;
