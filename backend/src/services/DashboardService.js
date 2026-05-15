const { User, Student, Teacher, Class, Attendance, Mark, Invoice, FeePayment, DisciplinaryRecord, Message } = require('../models');
const { Op } = require('sequelize');

class DashboardService {
  async getAdminDashboard() {
    const [totalStudents, totalTeachers, totalClasses, totalUsers] = await Promise.all([
      Student.count({ where: { status: 'active' } }),
      Teacher.count({ where: { employmentStatus: 'active' } }),
      Class.count(),
      User.count({ where: { isActive: true } }),
    ]);
    const todayAttendance = await Attendance.count({
      where: { date: new Date().toISOString().split('T')[0], status: 'absent' },
    });
    const pendingPayments = await Invoice.sum('balance', { where: { status: { [Op.ne]: 'paid' } } });
    return { totalStudents, totalTeachers, totalClasses, totalUsers, todayAttendance, pendingPayments };
  }

  async getTeacherDashboard(teacherId) {
    const teacher = await Teacher.findOne({
      where: { userId: teacherId },
      include: [{ association: 'subjectAllocations', include: ['subject', 'class', 'section'] }],
    });
    return { allocations: teacher?.subjectAllocations || [] };
  }

  async getStudentDashboard(studentId) {
    const attendance = await Attendance.findAll({
      where: { studentId },
      order: [['date', 'DESC']],
      limit: 30,
    });
    const marks = await Mark.findAll({
      where: { studentId, status: 'approved' },
      include: ['exam', 'subject'],
      limit: 20,
    });
    const invoices = await Invoice.findAll({
      where: { studentId },
      include: ['feeStructure'],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    return { attendance, marks, invoices };
  }

  async getParentDashboard(userId) {
    const parent = await require('../models').Parent.findOne({
      where: { userId },
      include: [{ association: 'children', include: ['user', 'class', 'section'] }],
    });
    return { children: parent?.children || [] };
  }
}

module.exports = new DashboardService();
