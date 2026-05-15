const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/LevelTradeController');
const auditLog = require('../middleware/audit');

router.get('/levels', ctrl.getLevels);
router.get('/trades', ctrl.getTrades);
router.get('/levels/with-classes', authenticate, ctrl.getLevelsWithClasses);

router.post('/levels', authenticate, authorize('super_admin', 'admin'), auditLog('CREATE', 'Level'), ctrl.createLevel);
router.put('/levels/:id', authenticate, authorize('super_admin', 'admin'), auditLog('UPDATE', 'Level'), ctrl.updateLevel);
router.delete('/levels/:id', authenticate, authorize('super_admin'), auditLog('DELETE', 'Level'), ctrl.deleteLevel);

router.post('/trades', authenticate, authorize('super_admin', 'admin'), auditLog('CREATE', 'Trade'), ctrl.createTrade);
router.put('/trades/:id', authenticate, authorize('super_admin', 'admin'), auditLog('UPDATE', 'Trade'), ctrl.updateTrade);
router.delete('/trades/:id', authenticate, authorize('super_admin'), auditLog('DELETE', 'Trade'), ctrl.deleteTrade);

module.exports = router;
