const sectionService = require('../services/SectionService');
const response = require('../utils/response');

const getSections = async (req, res, next) => {
  try {
    const sections = await sectionService.getSections(req.query);
    response.success(res, sections);
  } catch (err) { next(err); }
};

const getSectionById = async (req, res, next) => {
  try {
    const section = await sectionService.getSectionById(req.params.id);
    response.success(res, section);
  } catch (err) { next(err); }
};

const createSection = async (req, res, next) => {
  try {
    const section = await sectionService.createSection(req.body);
    response.created(res, section, 'Section created successfully');
  } catch (err) { next(err); }
};

const updateSection = async (req, res, next) => {
  try {
    const section = await sectionService.updateSection(req.params.id, req.body);
    response.success(res, section, 'Section updated successfully');
  } catch (err) { next(err); }
};

const deleteSection = async (req, res, next) => {
  try {
    await sectionService.deleteSection(req.params.id);
    response.success(res, null, 'Section deleted successfully');
  } catch (err) { next(err); }
};

module.exports = { getSections, getSectionById, createSection, updateSection, deleteSection };
