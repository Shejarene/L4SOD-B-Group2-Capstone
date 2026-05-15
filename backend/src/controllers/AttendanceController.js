const attendanceService = require('../services/AttendanceService');
const response = require('../utils/response');

const getAttendance = async (req, res, next) => {
  try {
    const result = await attendanceService.getAttendance(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const markAttendance = async (req, res, next) => {
  try {
    const records = await attendanceService.markAttendance(req.body.entries, req.user.id);
    response.created(res, records, 'Attendance marked successfully');
  } catch (err) { next(err); }
};

const getAttendanceReport = async (req, res, next) => {
  try {
    const records = await attendanceService.getAttendanceReport(
      req.query.classId, req.query.sectionId, req.query.startDate, req.query.endDate
    );
    response.success(res, records);
  } catch (err) { next(err); }
};

module.exports = { getAttendance, markAttendance, getAttendanceReport };
