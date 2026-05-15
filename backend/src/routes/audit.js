const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/AuditController');

router.use(authenticate);
router.use(authorize('super_admin', 'admin'));

router.get('/', ctrl.getLogs);
router.get('/recent', ctrl.getRecentActivity);

module.exports = router;
