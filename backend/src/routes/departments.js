const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { Department } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const response = require('../utils/response');

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const departments = await Department.findAll({ include: ['teachers', 'subjects'] });
    response.success(res, departments);
  } catch (err) { next(err); }
});

router.post('/', authorize('super_admin', 'admin'), async (req, res, next) => {
  try {
    const dept = await Department.create(req.body);
    response.created(res, dept, 'Department created');
  } catch (err) { next(err); }
});

router.put('/:id', authorize('super_admin', 'admin'), async (req, res, next) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) throw new AppError('Department not found', 404);
    await dept.update(req.body);
    response.success(res, dept, 'Department updated');
  } catch (err) { next(err); }
});

router.delete('/:id', authorize('super_admin', 'admin'), async (req, res, next) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) throw new AppError('Department not found', 404);
    await dept.destroy();
    response.success(res, null, 'Department deleted');
  } catch (err) { next(err); }
});

module.exports = router;
