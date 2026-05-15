const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/LostItemController');

router.use(authenticate);

router.get('/', ctrl.getItems);
router.get('/stats', authorize('super_admin', 'admin'), ctrl.getStats);
router.get('/pending-count', authorize('super_admin', 'admin'), ctrl.getPendingCount);
router.get('/my-reports', ctrl.getMyReports);
router.get('/:id', ctrl.getItemById);

router.post('/', [
  body('itemName').notEmpty().withMessage('Item name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('dateLost').notEmpty().withMessage('Date lost is required'),
], validate, ctrl.report);

router.patch('/:id/review', authorize('super_admin', 'admin'), [
  body('status').isIn(['approved', 'rejected', 'resolved']),
], validate, ctrl.reviewItem);

module.exports = router;
