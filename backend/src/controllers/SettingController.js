const { Setting } = require('../models');
const response = require('../utils/response');

const getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findAll();
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    response.success(res, map);
  } catch (err) { next(err); }
};

const updateSettings = async (req, res, next) => {
  try {
    const entries = req.body;
    for (const [key, value] of Object.entries(entries)) {
      await Setting.upsert({ key, value });
    }
    response.success(res, null, 'Settings updated');
  } catch (err) { next(err); }
};

module.exports = { getSettings, updateSettings };
