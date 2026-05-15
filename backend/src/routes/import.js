const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/ImportController');

router.use(authenticate);
router.use(authorize('super_admin', 'admin'));

router.post('/students', ctrl.importStudents);

module.exports = router;
