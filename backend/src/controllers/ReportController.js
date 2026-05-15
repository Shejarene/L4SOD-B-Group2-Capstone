const { Student, Mark, Exam } = require('../models');
const pdfService = require('../services/PdfService');
const emailService = require('../services/EmailService');
const response = require('../utils/response');
const { AppError } = require('../middleware/errorHandler');

const getReportCard = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId, {
      include: [
        { association: 'user', attributes: { exclude: ['password', 'refreshToken'] } },
        { association: 'class' },
        { association: 'parents', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }] },
      ],
    });
    if (!student) throw new AppError('Student not found', 404);

    const marks = await Mark.findAll({
      where: { studentId: student.id, status: 'approved' },
      include: [{ association: 'exam' }, { association: 'subject' }],
      order: [['createdAt', 'DESC']],
    });

    res.setHeader('Content-Type', 'application/json');
    response.success(res, { student, marks });
  } catch (err) { next(err); }
};

const downloadReportCardPdf = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId, {
      include: [
        { association: 'user', attributes: { exclude: ['password', 'refreshToken'] } },
        { association: 'class' },
      ],
    });
    if (!student) throw new AppError('Student not found', 404);

    const marks = await Mark.findAll({
      where: { studentId: student.id, status: 'approved' },
      include: [{ association: 'exam' }, { association: 'subject' }],
    });

    const pdf = await pdfService.generateReportCard(student, marks);
    const filename = `report-card-${student.admissionNumber}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (err) { next(err); }
};

const emailReportCard = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.studentId, {
      include: [
        { association: 'user', attributes: { exclude: ['password', 'refreshToken'] } },
        { association: 'class' },
        { association: 'parents', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }] },
      ],
    });
    if (!student) throw new AppError('Student not found', 404);

    const marks = await Mark.findAll({
      where: { studentId: student.id, status: 'approved' },
      include: [{ association: 'exam' }, { association: 'subject' }],
    });

    const pdf = await pdfService.generateReportCard(student, marks);
    await emailService.sendReportCard(student, marks, pdf);

    response.success(res, null, 'Report card emailed successfully');
  } catch (err) { next(err); }
};

module.exports = { getReportCard, downloadReportCardPdf, emailReportCard };
