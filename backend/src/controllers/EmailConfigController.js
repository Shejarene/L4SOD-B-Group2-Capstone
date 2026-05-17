const emailService = require('../services/EmailService');
const response = require('../utils/response');

const testEmail = async (req, res, next) => {
  try {
    const { to } = req.body;
    if (!to) return res.status(400).json({ success: false, message: 'Recipient email is required' });
    await emailService.sendEmail({
      to,
      subject: 'Test Email from Acadex',
      html: '<h2>Email Configuration Works!</h2><p>Your SMTP settings are configured correctly.</p>',
    });
    response.success(res, null, 'Test email sent successfully');
  } catch (err) { next(err); }
};

module.exports = { testEmail };
