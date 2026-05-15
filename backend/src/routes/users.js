const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/UserController');

const auditLog = require('../middleware/audit');

router.use(authenticate);
router.use(authorize('super_admin', 'admin'));

router.get('/', ctrl.getUsers);
router.get('/:id', ctrl.getUserById);
router.post('/', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('role').isIn(['super_admin', 'admin', 'principal', 'dos', 'discipline_master', 'accountant', 'teacher', 'student', 'parent']),
], validate, auditLog('CREATE', 'User'), ctrl.createUser);
router.put('/:id', auditLog('UPDATE', 'User'), ctrl.updateUser);
router.patch('/:id/toggle-status', auditLog('TOGGLE_STATUS', 'User'), ctrl.toggleUserStatus);
router.delete('/:id', authorize('super_admin'), auditLog('DELETE', 'User'), ctrl.deleteUser);

router.post('/student', [
  body('email').isEmail(),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('classId').notEmpty(),
], validate, auditLog('CREATE_STUDENT', 'User'), ctrl.createStudentAccount);

router.post('/teacher', [
  body('email').isEmail(),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
], validate, auditLog('CREATE_TEACHER', 'User'), ctrl.createTeacherAccount);

router.post('/parent', [
  body('email').isEmail(),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
], validate, auditLog('CREATE_PARENT', 'User'), ctrl.createParentAccount);

module.exports = router;
