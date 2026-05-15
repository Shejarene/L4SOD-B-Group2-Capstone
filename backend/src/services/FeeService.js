const { FeeStructure, Invoice, FeePayment, Student, Class } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { generateInvoiceNumber, generateReceiptNumber, paginate, formatPaginatedResponse } = require('../utils/helpers');

class FeeService {
  async getFeeStructures(query) {
    const where = {};
    if (query.classId) where.classId = query.classId;
    if (query.academicYear) where.academicYear = query.academicYear;
    if (query.type) where.type = query.type;
    return FeeStructure.findAll({ where, include: ['class'] });
  }

  async createFeeStructure(data) {
    return FeeStructure.create(data);
  }

  async updateFeeStructure(id, data) {
    const fee = await FeeStructure.findByPk(id);
    if (!fee) throw new AppError('Fee structure not found', 404);
    await fee.update(data);
    return fee;
  }

  async deleteFeeStructure(id) {
    const fee = await FeeStructure.findByPk(id);
    if (!fee) throw new AppError('Fee structure not found', 404);
    await fee.destroy();
  }

  async generateInvoices(studentId, academicYear, term) {
    const student = await Student.findByPk(studentId, { include: ['class'] });
    if (!student) throw new AppError('Student not found', 404);
    const fees = await FeeStructure.findAll({
      where: { classId: student.classId, academicYear, term: term || null },
    });
    const invoices = [];
    for (const fee of fees) {
      const existing = await Invoice.findOne({
        where: { studentId, feeStructureId: fee.id, academicYear, term },
      });
      if (existing) continue;
      const invoice = await Invoice.create({
        invoiceNumber: generateInvoiceNumber(),
        studentId,
        feeStructureId: fee.id,
        amount: fee.amount,
        balance: fee.amount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        academicYear,
        term,
        status: 'pending',
      });
      invoices.push(invoice);
    }
    return invoices;
  }

  async getInvoices(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.status) where.status = query.status;
    if (query.academicYear) where.academicYear = query.academicYear;
    const { count, rows } = await Invoice.findAndCountAll({
      where,
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] },
        { association: 'feeStructure' },
        { association: 'payments' },
      ],
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }

  async recordPayment(data, userId) {
    const invoice = await Invoice.findByPk(data.invoiceId);
    if (!invoice) throw new AppError('Invoice not found', 404);
    if (invoice.status === 'paid') throw new AppError('Invoice already paid', 400);
    const payment = await FeePayment.create({
      receiptNumber: generateReceiptNumber(),
      studentId: invoice.studentId,
      invoiceId: invoice.id,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      notes: data.notes,
      receivedBy: userId,
    });
    const newPaid = parseFloat(invoice.paidAmount) + parseFloat(data.amount);
    const balance = parseFloat(invoice.amount) - newPaid;
    const status = balance <= 0 ? 'paid' : 'partial';
    await invoice.update({ paidAmount: newPaid, balance: Math.max(0, balance), status });
    return payment;
  }

  async getPayments(query) {
    const { offset, limit, page, perPage } = paginate(query);
    const where = {};
    if (query.studentId) where.studentId = query.studentId;
    if (query.invoiceId) where.invoiceId = query.invoiceId;
    if (query.paymentMethod) where.paymentMethod = query.paymentMethod;
    const { count, rows } = await FeePayment.findAndCountAll({
      where,
      include: [
        { association: 'student', include: [{ association: 'user', attributes: ['id', 'firstName', 'lastName'] }] },
        { association: 'invoice' },
      ],
      offset,
      limit,
      order: [['paymentDate', 'DESC']],
    });
    return formatPaginatedResponse(rows, count, page, perPage);
  }
}

module.exports = new FeeService();
