const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/CommunicationController');

router.use(authenticate);

router.post('/messages', ctrl.sendMessage);
router.get('/messages', ctrl.getMessages);
router.patch('/messages/:id/read', ctrl.markAsRead);
router.get('/messages/unread/count', ctrl.getUnreadCount);

router.post('/announcements', authorize('super_admin', 'admin', 'principal'), ctrl.createAnnouncement);
router.get('/announcements', ctrl.getAnnouncements);
router.delete('/announcements/:id', authorize('super_admin', 'admin', 'principal'), ctrl.deleteAnnouncement);

module.exports = router;
