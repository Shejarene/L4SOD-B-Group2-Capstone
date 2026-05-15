const { Teacher, User, Department, SubjectAllocation, LeaveRequest } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { paginate, formatPaginatedResponse } = require('../utils/helpers');

class TeacherService {
  async getTeachers(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.employmentStatus) where.employmentStatus = query.employmentStatus;
    if (query.search) {
      where[require('sequelize').Op.or] = [
        { '$user.firstName$': { [require('sequelize').Op.iLike]: `%${query.search}%` } },
        { '$user.lastName$': { [require('sequelize').Op.iLike]: `%${query.search}%` } },
        { staffNumber: { [require('sequelize').Op.iLike]: `%${query.search}%` } },
      ];
    }
    const { count, rows } = await Teacher.findAndCountAll({
      where,
      include: [
        { association: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'profilePicture'] },
        { association: 'department' },
        { association: 'subjectAllocations', include: ['subject', 'class', 'section'] },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async getTeacherById(id) {
    const teacher = await Teacher.findByPk(id, {
      include: [
        { association: 'user', attributes: { exclude: ['password', 'refreshToken'] } },
        { association: 'department' },
        { association: 'subjectAllocations', include: ['subject', 'class', 'section'] },
        { association: 'leaveRequests' },
      ],
    });
    if (!teacher) throw new AppError('Teacher not found', 404);
    return teacher;
  }

  async updateTeacher(id, data) {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) throw new AppError('Teacher not found', 404);
    await teacher.update(data);
    return teacher;
  }
}

module.exports = new TeacherService();
