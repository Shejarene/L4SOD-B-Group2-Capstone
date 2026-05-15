const { AuditLog } = require('../models');

const auditLog = (action, entity) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = async function (body) {
      try {
        await AuditLog.create({
          action,
          entity,
          entityId: req.params.id || body?.data?.id || null,
          details: { body: req.body, query: req.query, response: body },
          userId: req.user?.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
        });
      } catch (err) {
        console.error('Audit log error:', err);
      }
      return originalJson(body);
    };
    next();
  };
};

module.exports = auditLog;
