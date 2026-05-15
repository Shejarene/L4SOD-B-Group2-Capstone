const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/LoginRequestController');

router.post('/', [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('email').isEmail(),
  body('requestedRole').notEmpty(),
], validate, ctrl.submitRequest);

router.use(authenticate);
router.use(authorize('super_admin'));

router.get('/', ctrl.getRequests);
router.patch('/:id/review', [
  body('status').isIn(['approved', 'rejected']),
], validate, ctrl.reviewRequest);

module.exports = router;
