const { Level, Trade, Class: Classroom } = require('../models');
const response = require('../utils/response');

const getLevels = async (req, res, next) => {
  try {
    const levels = await Level.findAll({ order: [['number', 'ASC']] });
    response.success(res, levels);
  } catch (err) { next(err); }
};

const createLevel = async (req, res, next) => {
  try {
    const level = await Level.create(req.body);
    response.created(res, level, 'Level created');
  } catch (err) { next(err); }
};

const updateLevel = async (req, res, next) => {
  try {
    const level = await Level.findByPk(req.params.id);
    if (!level) throw new AppError('Level not found', 404);
    await level.update(req.body);
    response.success(res, level, 'Level updated');
  } catch (err) { next(err); }
};

const deleteLevel = async (req, res, next) => {
  try {
    const level = await Level.findByPk(req.params.id);
    if (!level) throw new AppError('Level not found', 404);
    await level.destroy();
    response.success(res, null, 'Level deleted');
  } catch (err) { next(err); }
};

const getTrades = async (req, res, next) => {
  try {
    const trades = await Trade.findAll({ order: [['code', 'ASC']] });
    response.success(res, trades);
  } catch (err) { next(err); }
};

const createTrade = async (req, res, next) => {
  try {
    const trade = await Trade.create(req.body);
    response.created(res, trade, 'Trade created');
  } catch (err) { next(err); }
};

const updateTrade = async (req, res, next) => {
  try {
    const trade = await Trade.findByPk(req.params.id);
    if (!trade) throw new AppError('Trade not found', 404);
    await trade.update(req.body);
    response.success(res, trade, 'Trade updated');
  } catch (err) { next(err); }
};

const deleteTrade = async (req, res, next) => {
  try {
    const trade = await Trade.findByPk(req.params.id);
    if (!trade) throw new AppError('Trade not found', 404);
    await trade.destroy();
    response.success(res, null, 'Trade deleted');
  } catch (err) { next(err); }
};

const getLevelsWithClasses = async (req, res, next) => {
  try {
    const levels = await Level.findAll({
      include: [{ association: 'classes', include: ['trade'] }],
      order: [['number', 'ASC']],
    });
    response.success(res, levels);
  } catch (err) { next(err); }
};

module.exports = {
  getLevels, createLevel, updateLevel, deleteLevel,
  getTrades, createTrade, updateTrade, deleteTrade,
  getLevelsWithClasses
};
