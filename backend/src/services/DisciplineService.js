const { DisciplinaryRecord, Student } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { paginate, formatPaginatedResponse } = require('../utils/helpers');

class DisciplineService {
  async getRecords(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    const { count, rows } = await DisciplinaryRecord.findAndCountAll({
      where,
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async createRecord(data, userId) {
    const student = await Student.findByPk(data.studentId);
    if (!student) throw new AppError('Student not found', 404);
    return DisciplinaryRecord.create({ ...data, recordedBy: userId });
  }

  async updateRecord(id, data) {
    const record = await DisciplinaryRecord.findByPk(id);
    if (!record) throw new AppError('Record not found', 404);
    await record.update(data);
    return record;
  }

  async resolveRecord(id) {
    const record = await DisciplinaryRecord.findByPk(id);
    if (!record) throw new AppError('Record not found', 404);
    await record.update({ status: 'resolved', resolvedAt: new Date() });
    return record;
  }
}

module.exports = new DisciplineService();
