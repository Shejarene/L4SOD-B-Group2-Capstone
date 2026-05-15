const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/ReportController');

router.use(authenticate);

router.get('/report-card/:studentId', ctrl.getReportCard);
router.get('/report-card/:studentId/pdf', ctrl.downloadReportCardPdf);
router.post('/report-card/:studentId/email', authorize('super_admin', 'admin', 'dos'), ctrl.emailReportCard);

module.exports = router;
