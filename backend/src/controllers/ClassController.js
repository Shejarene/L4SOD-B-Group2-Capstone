const classService = require('../services/ClassService');
const response = require('../utils/response');

const getClasses = async (req, res, next) => {
  try {
    const classes = await classService.getClasses();
    response.success(res, classes);
  } catch (err) { next(err); }
};

const getClassById = async (req, res, next) => {
  try {
    const cls = await classService.getClassById(req.params.id);
    response.success(res, cls);
  } catch (err) { next(err); }
};

const createClass = async (req, res, next) => {
  try {
    const cls = await classService.createClass(req.body);
    response.created(res, cls, 'Classroom created successfully');
  } catch (err) { next(err); }
};

const updateClass = async (req, res, next) => {
  try {
    const cls = await classService.updateClass(req.params.id, req.body);
    response.success(res, cls, 'Classroom updated successfully');
  } catch (err) { next(err); }
};

const deleteClass = async (req, res, next) => {
  try {
    await classService.deleteClass(req.params.id);
    response.success(res, null, 'Classroom deleted successfully');
  } catch (err) { next(err); }
};

module.exports = { getClasses, getClassById, createClass, updateClass, deleteClass };
