const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/SectionController');
const auditLog = require('../middleware/audit');

router.use(authenticate);

router.get('/', ctrl.getSections);
router.get('/:id', ctrl.getSectionById);

router.post('/', authorize('super_admin', 'admin', 'dos'), auditLog('CREATE', 'Section'), ctrl.createSection);
router.put('/:id', authorize('super_admin', 'admin', 'dos'), auditLog('UPDATE', 'Section'), ctrl.updateSection);
router.delete('/:id', authorize('super_admin', 'admin', 'dos'), auditLog('DELETE', 'Section'), ctrl.deleteSection);

module.exports = router;
