const { Message, Announcement, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { paginate, formatPaginatedResponse } = require('../utils/helpers');

class CommunicationService {
  async sendMessage(data, senderId) {
    const receiver = await User.findByPk(data.receiverId);
    if (!receiver) throw new AppError('Recipient not found', 404);
    return Message.create({
      senderId,
      receiverId: data.receiverId,
      subject: data.subject,
      body: data.body,
      parentMessageId: data.parentMessageId || null,
    });
  }

  async getMessages(userId, query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {
      [require('sequelize').Op.or]: [{ senderId: userId }, { receiverId: userId }],
    };
    const { count, rows } = await Message.findAndCountAll({
      where,
      include: [
        { association: 'sender', attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePicture'] },
        { association: 'receiver', attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePicture'] },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async markAsRead(messageId, userId) {
    const message = await Message.findOne({ where: { id: messageId, receiverId: userId } });
    if (!message) throw new AppError('Message not found', 404);
    await message.update({ isRead: true, readAt: new Date() });
    return message;
  }

  async getUnreadCount(userId) {
    return Message.count({ where: { receiverId: userId, isRead: false } });
  }

  async createAnnouncement(data, userId) {
    return Announcement.create({ ...data, createdBy: userId });
  }

  async getAnnouncements(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.priority) where.priority = query.priority;
    const { count, rows } = await Announcement.findAndCountAll({
      where,
      include: [{ association: 'creator', attributes: ['id', 'firstName', 'lastName', 'role'] }],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async deleteAnnouncement(id) {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) throw new AppError('Announcement not found', 404);
    await announcement.destroy();
  }
}

module.exports = new CommunicationService();
