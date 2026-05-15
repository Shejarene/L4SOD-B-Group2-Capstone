const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const generateReceiptNumber = () => {
  const prefix = 'RCT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const generateAdmissionNumber = (classCode, year) => {
  const seq = Math.floor(Math.random() * 9999) + 1;
  return `${year}/${classCode}/${String(seq).padStart(4, '0')}`;
};

const generateStaffNumber = (deptCode, year) => {
  const seq = Math.floor(Math.random() * 999) + 1;
  return `STF/${year}/${deptCode}/${String(seq).padStart(3, '0')}`;
};

const calculateGrade = (score, gradingScale) => {
  const scale = gradingScale || [
    { min: 80, max: 100, grade: 'A', remark: 'Excellent' },
    { min: 70, max: 79, grade: 'B', remark: 'Very Good' },
    { min: 60, max: 69, grade: 'C', remark: 'Good' },
    { min: 50, max: 59, grade: 'D', remark: 'Fair' },
    { min: 40, max: 49, grade: 'E', remark: 'Poor' },
    { min: 0, max: 39, grade: 'F', remark: 'Fail' },
  ];

  const entry = scale.find(s => score >= s.min && score <= s.max);
  return entry ? { grade: entry.grade, remark: entry.remark } : { grade: 'F', remark: 'Fail' };
};

const paginate = ({ page = 1, perPage = 20 }) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const pp = Math.min(100, Math.max(1, parseInt(perPage, 10) || 20));
  return { offset: (p - 1) * pp, limit: pp, page: p, perPage: pp };
};

const formatPaginatedResponse = (data, total, page, perPage) => ({
  data,
  meta: {
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  },
});

module.exports = {
  generateInvoiceNumber,
  generateReceiptNumber,
  generateAdmissionNumber,
  generateStaffNumber,
  calculateGrade,
  paginate,
  formatPaginatedResponse,
};
