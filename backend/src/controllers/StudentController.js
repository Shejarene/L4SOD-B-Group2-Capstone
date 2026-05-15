const studentService = require('../services/StudentService');
const response = require('../utils/response');

const getStudents = async (req, res, next) => {
  try {
    const result = await studentService.getStudents(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    response.success(res, student);
  } catch (err) { next(err); }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    response.success(res, student, 'Student updated successfully');
  } catch (err) { next(err); }
};

const linkParent = async (req, res, next) => {
  try {
    const student = await studentService.linkParent(req.params.id, req.body.parentId);
    response.success(res, student, 'Parent linked successfully');
  } catch (err) { next(err); }
};

const getStudentPerformance = async (req, res, next) => {
  try {
    const performance = await studentService.getStudentPerformance(req.params.id);
    response.success(res, performance);
  } catch (err) { next(err); }
};

module.exports = { getStudents, getStudentById, updateStudent, linkParent, getStudentPerformance };
