const communicationService = require('../services/CommunicationService');
const response = require('../utils/response');

const sendMessage = async (req, res, next) => {
  try {
    const message = await communicationService.sendMessage(req.body, req.user.id);
    response.created(res, message, 'Message sent');
  } catch (err) { next(err); }
};

const getMessages = async (req, res, next) => {
  try {
    const result = await communicationService.getMessages(req.user.id, req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const markAsRead = async (req, res, next) => {
  try {
    const message = await communicationService.markAsRead(req.params.id, req.user.id);
    response.success(res, message, 'Message marked as read');
  } catch (err) { next(err); }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await communicationService.getUnreadCount(req.user.id);
    response.success(res, { count });
  } catch (err) { next(err); }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await communicationService.createAnnouncement(req.body, req.user.id);
    response.created(res, announcement, 'Announcement created');
  } catch (err) { next(err); }
};

const getAnnouncements = async (req, res, next) => {
  try {
    const result = await communicationService.getAnnouncements(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    await communicationService.deleteAnnouncement(req.params.id);
    response.success(res, null, 'Announcement deleted');
  } catch (err) { next(err); }
};

module.exports = { sendMessage, getMessages, markAsRead, getUnreadCount, createAnnouncement, getAnnouncements, deleteAnnouncement };
