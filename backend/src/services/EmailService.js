const nodemailer = require('nodemailer');
const { Setting } = require('../models');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  async getConfig() {
    const settings = await Setting.findAll();
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    return {
      host: map.smtp_host || 'smtp.gmail.com',
      port: parseInt(map.smtp_port, 10) || 587,
      secure: map.smtp_secure === 'true',
      user: map.smtp_user || '',
      pass: map.smtp_pass || '',
      from: map.smtp_from || 'noreply@school.com',
    };
  }

  async createTransporter() {
    const config = await this.getConfig();
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
    return config;
  }

  async sendEmail({ to, subject, html, attachments }) {
    const config = await this.createTransporter();
    await this.transporter.sendMail({
      from: `"Acadex" <${config.from}>`,
      to,
      subject,
      html,
      attachments,
    });
  }

  async sendBulkEmail(recipients, subject, html) {
    const config = await this.createTransporter();
    const promises = recipients.map(to =>
      this.transporter.sendMail({
        from: `"Acadex" <${config.from}>`,
        to,
        subject,
        html,
      })
    );
    await Promise.all(promises);
  }

  async sendReportCard(student, marks, pdfBuffer) {
    const html = `
      <h2>Report Card - ${student.user.firstName} ${student.user.lastName}</h2>
      <p>Dear Parent/Guardian,</p>
      <p>Please find attached the report card for ${student.user.firstName} ${student.user.lastName}.</p>
      <p>Regards,<br/>Acadex</p>
    `;
    await this.sendEmail({
      to: student.user.email,
      subject: `Report Card - ${student.user.firstName} ${student.user.lastName}`,
      html,
      attachments: [{
        filename: `report-card-${student.user.firstName}-${student.user.lastName}.pdf`,
        content: pdfBuffer,
      }],
    });
    if (student.parents?.length) {
      for (const parent of student.parents) {
        if (parent.user?.email) {
          await this.sendEmail({
            to: parent.user.email,
            subject: `Report Card - ${student.user.firstName} ${student.user.lastName}`,
            html,
            attachments: [{
              filename: `report-card-${student.admissionNumber}.pdf`,
              content: pdfBuffer,
            }],
          });
        }
      }
    }
  }
}

module.exports = new EmailService();
