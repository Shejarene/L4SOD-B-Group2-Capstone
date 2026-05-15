const { Student, User, Class, Section, Parent, Attendance, Mark, FeePayment } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { paginate, formatPaginatedResponse } = require('../utils/helpers');

class StudentService {
  async getStudents(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.classId) where.classId = query.classId;
    if (query.sectionId) where.sectionId = query.sectionId;
    if (query.status) where.status = query.status;
    if (query.search) {
      where[require('sequelize').Op.or] = [
        { '$user.firstName$': { [require('sequelize').Op.iLike]: `%${query.search}%` } },
        { '$user.lastName$': { [require('sequelize').Op.iLike]: `%${query.search}%` } },
        { admissionNumber: { [require('sequelize').Op.iLike]: `%${query.search}%` } },
      ];
    }
    const { count, rows } = await Student.findAndCountAll({
      where,
      include: [
        { association: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'profilePicture'] },
        { association: 'class' },
        { association: 'section' },
        { association: 'parents', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }] },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async getStudentById(id) {
    const student = await Student.findByPk(id, {
      include: [
        { association: 'user', attributes: { exclude: ['password', 'refreshToken'] } },
        { association: 'class' },
        { association: 'section' },
        { association: 'parents', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] }] },
        { association: 'attendance' },
        { association: 'marks', include: ['exam', 'subject'] },
        { association: 'payments', include: ['invoice'] },
        { association: 'disciplinaryRecords' },
      ],
    });
    if (!student) throw new AppError('Student not found', 404);
    return student;
  }

  async updateStudent(id, data) {
    const student = await Student.findByPk(id);
    if (!student) throw new AppError('Student not found', 404);
    await student.update(data);
    return student;
  }

  async linkParent(studentId, parentId) {
    const student = await Student.findByPk(studentId);
    if (!student) throw new AppError('Student not found', 404);
    const parent = await Parent.findByPk(parentId);
    if (!parent) throw new AppError('Parent not found', 404);
    await student.addParent(parent);
    return student;
  }

  async getStudentPerformance(studentId) {
    const student = await Student.findByPk(studentId, {
      include: [
        { association: 'user' },
        { association: 'class' },
        { association: 'marks', include: ['exam', 'subject'] },
        { association: 'attendance' },
      ],
    });
    if (!student) throw new AppError('Student not found', 404);
    return student;
  }
}

module.exports = new StudentService();
