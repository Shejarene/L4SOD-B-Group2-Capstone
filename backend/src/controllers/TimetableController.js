const timetableService = require('../services/TimetableService');
const response = require('../utils/response');

const getTimetable = async (req, res, next) => {
  try {
    const entries = await timetableService.getTimetable(req.query);
    response.success(res, entries);
  } catch (err) { next(err); }
};

const createEntry = async (req, res, next) => {
  try {
    const entry = await timetableService.createEntry(req.body);
    response.created(res, entry, 'Timetable entry created');
  } catch (err) { next(err); }
};

const updateEntry = async (req, res, next) => {
  try {
    const entry = await timetableService.updateEntry(req.params.id, req.body);
    response.success(res, entry, 'Timetable entry updated');
  } catch (err) { next(err); }
};

const deleteEntry = async (req, res, next) => {
  try {
    await timetableService.deleteEntry(req.params.id);
    response.success(res, null, 'Timetable entry deleted');
  } catch (err) { next(err); }
};

module.exports = { getTimetable, createEntry, updateEntry, deleteEntry };
