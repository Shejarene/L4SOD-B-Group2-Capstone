const { User, Student, Teacher, Parent } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { generateAdmissionNumber, generateStaffNumber, paginate, formatPaginatedResponse } = require('../utils/helpers');

class UserService {
  async createUser(data) {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) throw new AppError('Email already exists', 409);
    return User.create(data);
  }

  async getUsers(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.role) where.role = query.role;
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${query.search}%` } },
        { lastName: { [Op.iLike]: `%${query.search}%` } },
        { email: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    const { count, rows } = await User.findAndCountAll({ where, offset, limit, order: [['createdAt', 'DESC']] });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [
        { association: 'studentProfile' },
        { association: 'teacherProfile' },
        { association: 'parentProfile' },
      ],
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('User not found', 404);
    if (data.email && data.email !== user.email) {
      const existing = await User.findOne({ where: { email: data.email } });
      if (existing) throw new AppError('Email already exists', 409);
    }
    await user.update(data);
    return user;
  }

  async toggleUserStatus(id) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('User not found', 404);
    await user.update({ isActive: !user.isActive });
    return user;
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new AppError('User not found', 404);
    await user.destroy();
  }

  async createStudentAccount(data) {
    const user = await this.createUser({
      ...data,
      role: 'student',
      password: data.password || 'student123',
    });
    const student = await Student.create({
      userId: user.id,
      admissionNumber: generateAdmissionNumber(data.classCode || 'GEN', new Date().getFullYear()),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      classId: data.classId,
      sectionId: data.sectionId,
    });
    return { user, student };
  }

  async createTeacherAccount(data) {
    const user = await this.createUser({
      ...data,
      role: 'teacher',
      password: data.password || 'teacher123',
    });
    const teacher = await Teacher.create({
      userId: user.id,
      staffNumber: generateStaffNumber(data.deptCode || 'GEN', new Date().getFullYear()),
      qualification: data.qualification,
      specialization: data.specialization,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      departmentId: data.departmentId,
      employmentDate: data.employmentDate,
      salary: data.salary,
    });
    return { user, teacher };
  }

  async createParentAccount(data) {
    const user = await this.createUser({
      ...data,
      role: 'parent',
      password: data.password || 'parent123',
    });
    const parent = await Parent.create({
      userId: user.id,
      occupation: data.occupation,
      relationship: data.relationship,
      address: data.address,
    });
    return { user, parent };
  }
}

const { Op } = require('sequelize');
module.exports = new UserService();
