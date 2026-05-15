const { Mark, Exam, Subject, Student, Class, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { calculateGrade, paginate, formatPaginatedResponse } = require('../utils/helpers');

class MarksService {
  async getMarks(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.examId) where.examId = query.examId;
    if (query.subjectId) where.subjectId = query.subjectId;
    if (query.classId) where.classId = query.classId;
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;
    const { count, rows } = await Mark.findAndCountAll({
      where,
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] },
        { association: 'exam' },
        { association: 'subject' },
        { association: 'class' },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async enterMark(data, userId) {
    const student = await Student.findByPk(data.studentId);
    if (!student) throw new AppError('Student not found', 404);
    const exam = await Exam.findByPk(data.examId);
    if (!exam) throw new AppError('Exam not found', 404);
    if (data.score > exam.maxScore) {
      throw new AppError(`Score cannot exceed ${exam.maxScore}`, 400);
    }
    const existing = await Mark.findOne({
      where: { studentId: data.studentId, examId: data.examId, subjectId: data.subjectId },
    });
    if (existing) {
      if (existing.status === 'approved') throw new AppError('Approved marks cannot be edited', 400);
      const grade = calculateGrade(data.score);
      await existing.update({ ...data, grade: grade.grade, remark: grade.remark, status: 'draft' });
      return existing;
    }
    const grade = calculateGrade(data.score);
    const mark = await Mark.create({
      ...data,
      grade: grade.grade,
      remark: grade.remark,
      status: 'draft',
    });
    return mark;
  }

  async batchEnterMarks(entries, userId) {
    const results = [];
    const errors = [];
    for (const entry of entries) {
      try {
        const mark = await this.enterMark(entry, userId);
        results.push(mark);
      } catch (err) {
        errors.push({ entry, error: err.message });
      }
    }
    return { results, errors };
  }

  async submitMarks(examId, subjectId, classId) {
    const marks = await Mark.findAll({ where: { examId, subjectId, classId, status: 'draft' } });
    if (!marks.length) throw new AppError('No draft marks found to submit', 404);
    await Mark.update({ status: 'submitted' }, { where: { examId, subjectId, classId, status: 'draft' } });
    return { count: marks.length };
  }

  async approveMarks(ids, userId) {
    const marks = await Mark.findAll({ where: { id: ids, status: 'submitted' } });
    if (!marks.length) throw new AppError('No submitted marks found', 404);
    await Mark.update(
      { status: 'approved', approvedBy: userId, approvedAt: new Date() },
      { where: { id: ids, status: 'submitted' } }
    );
    return { count: marks.length };
  }

  async rejectMarks(ids, reason) {
    const marks = await Mark.findAll({ where: { id: ids, status: 'submitted' } });
    if (!marks.length) throw new AppError('No submitted marks found', 404);
    await Mark.update({ status: 'rejected' }, { where: { id: ids, status: 'submitted' } });
    return { count: marks.length };
  }

  async getStudentReport(studentId, academicYear, term) {
    const marks = await Mark.findAll({
      where: { studentId, status: 'approved' },
      include: [
        { association: 'exam', where: { academicYear, term } },
        { association: 'subject' },
      ],
    });
    return marks;
  }
}

module.exports = new MarksService();
