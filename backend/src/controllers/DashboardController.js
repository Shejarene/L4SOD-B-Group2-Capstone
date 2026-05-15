const dashboardService = require('../services/DashboardService');
const response = require('../utils/response');

const getAdminDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getAdminDashboard();
    response.success(res, data);
  } catch (err) { next(err); }
};

const getTeacherDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getTeacherDashboard(req.user.id);
    response.success(res, data);
  } catch (err) { next(err); }
};

const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.params.studentId || req.user.studentProfile?.id;
    const data = await dashboardService.getStudentDashboard(studentId);
    response.success(res, data);
  } catch (err) { next(err); }
};

const getParentDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getParentDashboard(req.user.id);
    response.success(res, data);
  } catch (err) { next(err); }
};

module.exports = { getAdminDashboard, getTeacherDashboard, getStudentDashboard, getParentDashboard };
