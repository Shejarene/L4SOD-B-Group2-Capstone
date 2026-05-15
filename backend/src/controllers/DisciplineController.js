const disciplineService = require('../services/DisciplineService');
const response = require('../utils/response');

const getRecords = async (req, res, next) => {
  try {
    const result = await disciplineService.getRecords(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const createRecord = async (req, res, next) => {
  try {
    const record = await disciplineService.createRecord(req.body, req.user.id);
    response.created(res, record, 'Record created');
  } catch (err) { next(err); }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await disciplineService.updateRecord(req.params.id, req.body);
    response.success(res, record, 'Record updated');
  } catch (err) { next(err); }
};

const resolveRecord = async (req, res, next) => {
  try {
    const record = await disciplineService.resolveRecord(req.params.id);
    response.success(res, record, 'Record resolved');
  } catch (err) { next(err); }
};

module.exports = { getRecords, createRecord, updateRecord, resolveRecord };
