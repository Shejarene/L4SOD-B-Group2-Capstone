const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/FeeController');

const auditLog = require('../middleware/audit');

router.use(authenticate);

router.get('/structures', ctrl.getFeeStructures);
router.post('/structures', authorize('super_admin', 'admin', 'accountant'), auditLog('CREATE', 'FeeStructure'), ctrl.createFeeStructure);
router.put('/structures/:id', authorize('super_admin', 'admin', 'accountant'), auditLog('UPDATE', 'FeeStructure'), ctrl.updateFeeStructure);
router.delete('/structures/:id', authorize('super_admin', 'admin'), auditLog('DELETE', 'FeeStructure'), ctrl.deleteFeeStructure);

router.post('/invoices/generate', authorize('super_admin', 'admin', 'accountant'), auditLog('GENERATE_INVOICES', 'Invoice'), ctrl.generateInvoices);
router.get('/invoices', ctrl.getInvoices);

router.post('/payments', authorize('super_admin', 'admin', 'accountant'), auditLog('RECORD_PAYMENT', 'FeePayment'), ctrl.recordPayment);
router.get('/payments', ctrl.getPayments);

module.exports = router;
