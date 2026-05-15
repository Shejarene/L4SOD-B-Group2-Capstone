const { Subject, Department, Class, SubjectAllocation } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const response = require('../utils/response');

const getSubjects = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.classId) where.classId = req.query.classId;
    if (req.query.departmentId) where.departmentId = req.query.departmentId;
    const subjects = await Subject.findAll({ where, include: ['class', 'department'] });
    response.success(res, subjects);
  } catch (err) { next(err); }
};

const createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    response.created(res, subject, 'Subject created');
  } catch (err) { next(err); }
};

const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) throw new AppError('Subject not found', 404);
    await subject.update(req.body);
    response.success(res, subject, 'Subject updated');
  } catch (err) { next(err); }
};

const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) throw new AppError('Subject not found', 404);
    await subject.destroy();
    response.success(res, null, 'Subject deleted');
  } catch (err) { next(err); }
};

const allocateSubject = async (req, res, next) => {
  try {
    const allocation = await SubjectAllocation.create(req.body);
    response.created(res, allocation, 'Subject allocated');
  } catch (err) { next(err); }
};

const getAllocations = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.teacherId) where.teacherId = req.query.teacherId;
    if (req.query.subjectId) where.subjectId = req.query.subjectId;
    if (req.query.classId) where.classId = req.query.classId;
    const allocations = await SubjectAllocation.findAll({
      where,
      include: ['teacher', 'subject', 'class', 'section'],
    });
    response.success(res, allocations);
  } catch (err) { next(err); }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject, allocateSubject, getAllocations };
