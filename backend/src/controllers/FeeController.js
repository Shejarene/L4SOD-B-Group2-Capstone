const feeService = require('../services/FeeService');
const response = require('../utils/response');

const getFeeStructures = async (req, res, next) => {
  try {
    const fees = await feeService.getFeeStructures(req.query);
    response.success(res, fees);
  } catch (err) { next(err); }
};

const createFeeStructure = async (req, res, next) => {
  try {
    const fee = await feeService.createFeeStructure(req.body);
    response.created(res, fee, 'Fee structure created');
  } catch (err) { next(err); }
};

const updateFeeStructure = async (req, res, next) => {
  try {
    const fee = await feeService.updateFeeStructure(req.params.id, req.body);
    response.success(res, fee, 'Fee structure updated');
  } catch (err) { next(err); }
};

const deleteFeeStructure = async (req, res, next) => {
  try {
    await feeService.deleteFeeStructure(req.params.id);
    response.success(res, null, 'Fee structure deleted');
  } catch (err) { next(err); }
};

const generateInvoices = async (req, res, next) => {
  try {
    const invoices = await feeService.generateInvoices(req.body.studentId, req.body.academicYear, req.body.term);
    response.created(res, invoices, 'Invoices generated');
  } catch (err) { next(err); }
};

const getInvoices = async (req, res, next) => {
  try {
    const result = await feeService.getInvoices(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const recordPayment = async (req, res, next) => {
  try {
    const payment = await feeService.recordPayment(req.body, req.user.id);
    response.created(res, payment, 'Payment recorded');
  } catch (err) { next(err); }
};

const getPayments = async (req, res, next) => {
  try {
    const result = await feeService.getPayments(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

module.exports = { getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure, generateInvoices, getInvoices, recordPayment, getPayments };
