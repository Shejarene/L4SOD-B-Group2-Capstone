const marksService = require('../services/MarksService');
const response = require('../utils/response');

const getMarks = async (req, res, next) => {
  try {
    const result = await marksService.getMarks(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const enterMark = async (req, res, next) => {
  try {
    const mark = await marksService.enterMark(req.body, req.user.id);
    response.created(res, mark, 'Mark entered successfully');
  } catch (err) { next(err); }
};

const batchEnterMarks = async (req, res, next) => {
  try {
    const result = await marksService.batchEnterMarks(req.body.entries, req.user.id);
    response.success(res, result, 'Batch marks processed');
  } catch (err) { next(err); }
};

const submitMarks = async (req, res, next) => {
  try {
    const result = await marksService.submitMarks(req.body.examId, req.body.subjectId, req.body.classId);
    response.success(res, result, 'Marks submitted for approval');
  } catch (err) { next(err); }
};

const approveMarks = async (req, res, next) => {
  try {
    const result = await marksService.approveMarks(req.body.ids, req.user.id);
    response.success(res, result, 'Marks approved successfully');
  } catch (err) { next(err); }
};

const rejectMarks = async (req, res, next) => {
  try {
    const result = await marksService.rejectMarks(req.body.ids, req.body.reason);
    response.success(res, result, 'Marks rejected');
  } catch (err) { next(err); }
};

module.exports = { getMarks, enterMark, batchEnterMarks, submitMarks, approveMarks, rejectMarks };
