const { Exam } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const response = require('../utils/response');

const getExams = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.classId) where.classId = req.query.classId;
    if (req.query.subjectId) where.subjectId = req.query.subjectId;
    if (req.query.academicYear) where.academicYear = req.query.academicYear;
    if (req.query.term) where.term = req.query.term;
    const exams = await Exam.findAll({ where, include: ['class', 'subject'] });
    response.success(res, exams);
  } catch (err) { next(err); }
};

const createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);
    response.created(res, exam, 'Exam created');
  } catch (err) { next(err); }
};

const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) throw new AppError('Exam not found', 404);
    await exam.update(req.body);
    response.success(res, exam, 'Exam updated');
  } catch (err) { next(err); }
};

const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) throw new AppError('Exam not found', 404);
    await exam.destroy();
    response.success(res, null, 'Exam deleted');
  } catch (err) { next(err); }
};

module.exports = { getExams, createExam, updateExam, deleteExam };
