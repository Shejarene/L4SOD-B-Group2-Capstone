const { Class, Level, Trade, Student, Subject, FeeStructure } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class ClassService {
  async getClasses() {
    return Class.findAll({
      include: [
        { association: 'level' },
        { association: 'trade' },
        { association: 'sections' },
        { association: 'students', include: ['user'] },
      ],
      order: [['name', 'ASC']],
    });
  }

  async getClassById(id) {
    const cls = await Class.findByPk(id, {
      include: [
        { association: 'level' },
        { association: 'trade' },
        { association: 'sections' },
        { association: 'students', include: ['user'] },
        { association: 'subjects' },
        { association: 'feeStructures' },
      ],
    });
    if (!cls) throw new AppError('Class not found', 404);
    return cls;
  }

  async createClass(data) {
    const existing = await Class.findOne({ where: { code: data.code } });
    if (existing) throw new AppError('Class code already exists', 409);
    return Class.create(data);
  }

  async updateClass(id, data) {
    const cls = await Class.findByPk(id);
    if (!cls) throw new AppError('Class not found', 404);
    await cls.update(data);
    return cls;
  }

  async deleteClass(id) {
    const cls = await Class.findByPk(id);
    if (!cls) throw new AppError('Class not found', 404);
    await cls.destroy();
  }
}

module.exports = new ClassService();
