const { AuditLog, User } = require('../models');
const response = require('../utils/response');
const { paginate, formatPaginatedResponse } = require('../utils/helpers');

const getLogs = async (req, res, next) => {
  try {
    const { offset, limit, page, perPage } = paginate(req.query);
    const where = {};
    
    if (req.query.userId) where.userId = req.query.userId;
    if (req.query.action) where.action = req.query.action;
    if (req.query.entity) where.entity = req.query.entity;

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [
        { association: 'user', attributes: ['id', 'firstName', 'lastName', 'role'] }
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    response.paginated(res, rows, count, page, perPage);
  } catch (err) {
    next(err);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const logs = await AuditLog.findAll({
      limit: 10,
      include: [
        { association: 'user', attributes: ['id', 'firstName', 'lastName', 'role'] }
      ],
      order: [['createdAt', 'DESC']],
    });
    response.success(res, logs);
  } catch (err) {
    next(err);
  }
};

module.exports = { getLogs, getRecentActivity };
