const lostItemService = require('../services/LostItemService');
const response = require('../utils/response');

const report = async (req, res, next) => {
  try {
    const item = await lostItemService.report(req.body, req.user.id);
    response.created(res, item, 'Lost item reported. Awaiting admin approval.');
  } catch (err) { next(err); }
};

const getItems = async (req, res, next) => {
  try {
    const result = await lostItemService.getItems(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const getItemById = async (req, res, next) => {
  try {
    const item = await lostItemService.getItemById(req.params.id);
    response.success(res, item);
  } catch (err) { next(err); }
};

const getMyReports = async (req, res, next) => {
  try {
    const result = await lostItemService.getMyReports(req.user.id, req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const reviewItem = async (req, res, next) => {
  try {
    const { status, adminRemark } = req.body;
    const item = await lostItemService.reviewItem(req.params.id, status, adminRemark, req.user.id);
    response.success(res, item, `Report ${status}`);
  } catch (err) { next(err); }
};

const getPendingCount = async (req, res, next) => {
  try {
    const count = await lostItemService.getPendingCount();
    response.success(res, { count });
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await lostItemService.getStats();
    response.success(res, stats);
  } catch (err) { next(err); }
};

module.exports = { report, getItems, getItemById, getMyReports, reviewItem, getPendingCount, getStats };
