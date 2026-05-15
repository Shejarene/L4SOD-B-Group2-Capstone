const authService = require('../services/AuthService');
const response = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    response.success(res, result, 'Login successful');
  } catch (err) { next(err); }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    response.success(res, result, 'Token refreshed');
  } catch (err) { next(err); }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    response.success(res, null, 'Logged out successfully');
  } catch (err) { next(err); }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    response.success(res, user);
  } catch (err) { next(err); }
};

module.exports = { login, refresh, logout, getProfile };
