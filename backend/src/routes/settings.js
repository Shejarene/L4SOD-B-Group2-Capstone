const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/SettingController');

router.use(authenticate);
router.use(authorize('super_admin', 'admin'));

router.get('/', ctrl.getSettings);
router.put('/', ctrl.updateSettings);

module.exports = router;
