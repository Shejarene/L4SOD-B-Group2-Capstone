const { Timetable, Class, Section, Subject, Teacher, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

class TimetableService {
  async getTimetable(query) {
    const where = {};
    if (query.classId) where.classId = query.classId;
    if (query.sectionId) where.sectionId = query.sectionId;
    if (query.teacherId) where.teacherId = query.teacherId;
    if (query.dayOfWeek !== undefined) where.dayOfWeek = query.dayOfWeek;
    if (query.academicYear) where.academicYear = query.academicYear;
    if (query.term) where.term = query.term;
    if (query.type) where.type = query.type;
    return Timetable.findAll({
      where,
      include: [
        { association: 'class' },
        { association: 'section' },
        { association: 'subject' },
        { association: 'teacher', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] },
      ],
      order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
    });
  }

  async createEntry(data) {
    const conflict = await this.detectConflict(data);
    if (conflict) throw new AppError(`Conflict detected: ${conflict}`, 409);
    return Timetable.create(data);
  }

  async updateEntry(id, data) {
    const entry = await Timetable.findByPk(id);
    if (!entry) throw new AppError('Timetable entry not found', 404);
    const conflict = await this.detectConflict({ ...entry.toJSON(), ...data }, id);
    if (conflict) throw new AppError(`Conflict detected: ${conflict}`, 409);
    await entry.update(data);
    return entry;
  }

  async deleteEntry(id) {
    const entry = await Timetable.findByPk(id);
    if (!entry) throw new AppError('Timetable entry not found', 404);
    await entry.destroy();
  }

  async detectConflict(data, excludeId) {
    const where = {
      dayOfWeek: data.dayOfWeek,
      academicYear: data.academicYear,
      term: data.term,
      [Op.or]: [
        {
          startTime: { [Op.lt]: data.endTime },
          endTime: { [Op.gt]: data.startTime },
        },
      ],
    };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    const conflicts = await Timetable.findAll({
      where: {
        ...where,
        [Op.and]: [
          { startTime: { [Op.lt]: data.endTime } },
          { endTime: { [Op.gt]: data.startTime } },
        ],
      },
    });
    for (const c of conflicts) {
      if (c.teacherId === data.teacherId) return `Teacher already has a class scheduled at this time`;
      if (c.room === data.room && data.room) return `Room ${data.room} is already occupied`;
      if (c.sectionId === data.sectionId) return `Section already has a class scheduled at this time`;
    }
    return null;
  }
}

module.exports = new TimetableService();
