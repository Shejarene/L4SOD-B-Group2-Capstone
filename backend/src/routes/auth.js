const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { login, refresh, logout, getProfile } = require('../controllers/AuthController');

const auditLog = require('../middleware/audit');

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, auditLog('LOGIN', 'User'), login);

router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
], validate, refresh);

router.post('/logout', authenticate, auditLog('LOGOUT', 'User'), logout);
router.get('/profile', authenticate, getProfile);

module.exports = router;
