const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const teacherService = require('../services/TeacherService');
const response = require('../utils/response');

router.use(authenticate);

router.get('/', authorize('super_admin', 'admin', 'principal', 'dos'), async (req, res, next) => {
  try {
    const result = await teacherService.getTeachers(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
});

router.get('/:id', authorize('super_admin', 'admin', 'principal', 'dos', 'teacher'), async (req, res, next) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    response.success(res, teacher);
  } catch (err) { next(err); }
});

router.put('/:id', authorize('super_admin', 'admin'), async (req, res, next) => {
  try {
    const teacher = await teacherService.updateTeacher(req.params.id, req.body);
    response.success(res, teacher, 'Teacher updated');
  } catch (err) { next(err); }
});

module.exports = router;
