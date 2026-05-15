const importService = require('../services/ImportService');
const response = require('../utils/response');

const importStudents = async (req, res, next) => {
  try {
    const { entries } = req.body;
    if (!entries || !Array.isArray(entries) || !entries.length) {
      return res.status(400).json({ success: false, message: 'Entries array is required' });
    }
    const result = await importService.importStudents(entries);
    response.success(res, result, `Imported ${result.created.length} students`);
  } catch (err) { next(err); }
};

module.exports = { importStudents };
