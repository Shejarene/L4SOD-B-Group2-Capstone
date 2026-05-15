const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

const created = (res, data = null, message = 'Created successfully') => {
  return res.status(201).json({
    success: true,
    data,
    message,
  });
};

const paginated = (res, data, total, page, perPage, message = 'Success') => {
  return res.status(200).json({
    success: true,
    data,
    message,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  });
};

module.exports = { success, created, paginated };
