const { Attendance, Student, Class, Section } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { paginate, formatPaginatedResponse } = require('../utils/helpers');

class AttendanceService {
  async getAttendance(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.date) where.date = query.date;
    if (query.classId) where.classId = query.classId;
    if (query.sectionId) where.sectionId = query.sectionId;
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;
    const { count, rows } = await Attendance.findAndCountAll({
      where,
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] },
        { association: 'class' },
        { association: 'section' },
      ],
      offset,
      limit,
      order: [['date', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async markAttendance(entries, userId) {
    const results = [];
    for (const entry of entries) {
      const [record, created] = await Attendance.findOrCreate({
        where: { studentId: entry.studentId, date: entry.date },
        defaults: {
          studentId: entry.studentId,
          classId: entry.classId,
          sectionId: entry.sectionId,
          date: entry.date,
          status: entry.status,
          remark: entry.remark,
          takenBy: userId,
        },
      });
      if (!created) {
        await record.update({ status: entry.status, remark: entry.remark, takenBy: userId });
      }
      results.push(record);
    }
    return results;
  }

  async getAttendanceReport(classId, sectionId, startDate, endDate) {
    const where = { classId };
    if (sectionId) where.sectionId = sectionId;
    if (startDate) where.date = { ...(where.date || {}), [require('sequelize').Op.gte]: startDate };
    if (endDate) where.date = { ...(where.date || {}), [require('sequelize').Op.lte]: endDate };
    const records = await Attendance.findAll({
      where,
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] },
      ],
      order: [['date', 'ASC']],
    });
    return records;
  }
}

module.exports = new AttendanceService();
