const { LoginRequest } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const response = require('../utils/response');
const { paginate, formatPaginatedResponse } = require('../utils/helpers');

const submitRequest = async (req, res, next) => {
  try {
    const existing = await LoginRequest.findOne({
      where: { email: req.body.email, status: 'pending' },
    });
    if (existing) throw new AppError('You already have a pending request with this email', 400);
    const request = await LoginRequest.create(req.body);
    response.created(res, request, 'Your request has been submitted. You will be notified when approved.');
  } catch (err) { next(err); }
};

const getRequests = async (req, res, next) => {
  try {
    const { offset, limit, page, perPage } = paginate(req.query);
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const { count, rows } = await LoginRequest.findAndCountAll({
      where, offset, limit, order: [['createdAt', 'DESC']],
    });
    response.paginated(res, rows, count, page, perPage);
  } catch (err) { next(err); }
};

const reviewRequest = async (req, res, next) => {
  try {
    const { status, adminRemark } = req.body;
    const request = await LoginRequest.findByPk(req.params.id);
    if (!request) throw new AppError('Request not found', 404);
    if (request.status !== 'pending') throw new AppError('Request already reviewed', 400);
    await request.update({
      status,
      adminRemark: adminRemark || '',
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    });
    response.success(res, request, `Request ${status}`);
  } catch (err) { next(err); }
};

module.exports = { submitRequest, getRequests, reviewRequest };
