const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/EmailConfigController');

router.use(authenticate);
router.use(authorize('super_admin', 'admin'));

router.post('/test', ctrl.testEmail);

module.exports = router;
