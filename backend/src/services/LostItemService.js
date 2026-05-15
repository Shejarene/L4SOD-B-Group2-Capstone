const { LostItem, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { paginate, formatPaginatedResponse } = require('../utils/helpers');

class LostItemService {
  async report(data, userId) {
    return LostItem.create({
      ...data,
      reportedBy: userId,
      status: 'pending',
    });
  }

  async getItems(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = 'approved';
    }
    if (query.category) where.category = query.category;
    if (query.reportedBy) where.reportedBy = query.reportedBy;

    const { count, rows } = await LostItem.findAndCountAll({
      where,
      include: [
        { association: 'reporter', attributes: ['id', 'firstName', 'lastName', 'email', 'role'] },
        { association: 'reviewer', attributes: ['id', 'firstName', 'lastName'] },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async getItemById(id) {
    const item = await LostItem.findByPk(id, {
      include: [
        { association: 'reporter', attributes: ['id', 'firstName', 'lastName', 'email', 'role'] },
        { association: 'reviewer', attributes: ['id', 'firstName', 'lastName'] },
      ],
    });
    if (!item) throw new AppError('Lost item report not found', 404);
    return item;
  }

  async getMyReports(userId, query) {
    const { offset, limit, page, perPage } = paginate(query);
    const { count, rows } = await LostItem.findAndCountAll({
      where: { reportedBy: userId },
      include: [
        { association: 'reporter', attributes: ['id', 'firstName', 'lastName'] },
        { association: 'reviewer', attributes: ['id', 'firstName', 'lastName'] },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async reviewItem(id, status, adminRemark, reviewerId) {
    const item = await LostItem.findByPk(id);
    if (!item) throw new AppError('Lost item report not found', 404);
    if (item.status !== 'pending') {
      throw new AppError('This report has already been reviewed', 400);
    }
    const update = { status, reviewedBy: reviewerId, adminRemark };
    if (status === 'resolved') update.resolvedAt = new Date();
    await item.update(update);
    return this.getItemById(id);
  }

  async getPendingCount() {
    return LostItem.count({ where: { status: 'pending' } });
  }

  async getStats() {
    const [pending, approved, rejected, resolved] = await Promise.all([
      LostItem.count({ where: { status: 'pending' } }),
      LostItem.count({ where: { status: 'approved' } }),
      LostItem.count({ where: { status: 'rejected' } }),
      LostItem.count({ where: { status: 'resolved' } }),
    ]);
    return { pending, approved, rejected, resolved, total: pending + approved + rejected + resolved };
  }
}

module.exports = new LostItemService();
