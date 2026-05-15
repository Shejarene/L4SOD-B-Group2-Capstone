const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/InviteController');

router.get('/verify/:token', ctrl.verifyInvite);
router.post('/accept/:token', [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('password').isLength({ min: 6 }),
], validate, ctrl.acceptInvite);

router.use(authenticate);
router.use(authorize('super_admin'));

router.post('/', [
  body('role').isIn(['teacher', 'student', 'parent', 'accountant', 'discipline_master', 'dos']),
], validate, ctrl.createInvite);
router.get('/', ctrl.getInvites);

module.exports = router;
