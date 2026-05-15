const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/ClassController');

router.use(authenticate);

router.get('/', ctrl.getClasses);
router.get('/:id', ctrl.getClassById);
router.post('/', authorize('super_admin', 'admin'), ctrl.createClass);
router.put('/:id', authorize('super_admin', 'admin'), ctrl.updateClass);
router.delete('/:id', authorize('super_admin', 'admin'), ctrl.deleteClass);

module.exports = router;
