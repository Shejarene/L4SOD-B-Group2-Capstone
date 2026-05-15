const { Section, Class, Student } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class SectionService {
  async getSections(query) {
    const where = {};
    if (query.classId) where.classId = query.classId;
    return Section.findAll({
      where,
      include: [
        { association: 'class' },
        { association: 'students', include: ['user'] }
      ],
      order: [['name', 'ASC']]
    });
  }

  async getSectionById(id) {
    const section = await Section.findByPk(id, {
      include: [
        { association: 'class' },
        { association: 'students', include: ['user'] }
      ]
    });
    if (!section) throw new AppError('Section not found', 404);
    return section;
  }

  async createSection(data) {
    const cls = await Class.findByPk(data.classId);
    if (!cls) throw new AppError('Class not found', 404);
    return Section.create(data);
  }

  async updateSection(id, data) {
    const section = await Section.findByPk(id);
    if (!section) throw new AppError('Section not found', 404);
    await section.update(data);
    return section;
  }

  async deleteSection(id) {
    const section = await Section.findByPk(id);
    if (!section) throw new AppError('Section not found', 404);
    await section.destroy();
  }
}

module.exports = new SectionService();
