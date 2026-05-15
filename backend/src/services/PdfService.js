const PDFDocument = require('pdfkit');

class PdfService {
  generateReportCard(student, allMarks) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const { user, class: cls } = student;
      const name = `${user.firstName} ${user.lastName}`;

      doc.fontSize(20).font('Helvetica-Bold').text('REPORT CARD', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').text('School Management System', { align: 'center' });
      doc.moveDown(1.5);

      const leftX = 50;
      let y = doc.y;

      doc.fontSize(11).font('Helvetica-Bold');
      doc.text('Student Name:', leftX, y);
      doc.font('Helvetica').text(`${name}`, leftX + 100, y);
      y += 18;

      doc.font('Helvetica-Bold');
      doc.text('Admission No:', leftX, y);
      doc.font('Helvetica').text(`${student.admissionNumber}`, leftX + 100, y);
      y += 18;

      doc.font('Helvetica-Bold');
      doc.text('Class:', leftX, y);
      doc.font('Helvetica').text(`${cls?.name || '-'}`, leftX + 100, y);
      y += 18;

      doc.font('Helvetica-Bold');
      doc.text('Status:', leftX, y);
      doc.font('Helvetica').text(`${student.status || '-'}`, leftX + 100, y);
      y += 30;

      const tableTop = y;
      const colWidths = [120, 80, 80, 80, 100];
      const headers = ['Subject', 'Score', 'Grade', 'Exam', 'Remark'];

      doc.font('Helvetica-Bold').fontSize(10);
      let x = leftX;
      headers.forEach((h, i) => {
        doc.text(h, x, tableTop, { width: colWidths[i], align: 'center' });
        x += colWidths[i];
      });

      y = tableTop + 18;
      doc.moveTo(leftX, y).lineTo(leftX + colWidths.reduce((a, b) => a + b, 0), y).stroke();
      y += 6;

      doc.font('Helvetica').fontSize(10);
      let totalScore = 0;
      let subjectCount = 0;

      (allMarks || []).forEach(m => {
        if (m.status !== 'approved') return;
        x = leftX;
        const rowY = y;
        const subjectName = m.subject?.name || '-';
        const score = parseFloat(m.score) || 0;
        totalScore += score;
        subjectCount++;

        doc.text(subjectName, x, rowY, { width: colWidths[0], align: 'center' });
        x += colWidths[0];
        doc.text(score.toString(), x, rowY, { width: colWidths[1], align: 'center' });
        x += colWidths[1];
        doc.text(m.grade || '-', x, rowY, { width: colWidths[2], align: 'center' });
        x += colWidths[2];
        doc.text(m.exam?.name || '-', x, rowY, { width: colWidths[3], align: 'center' });
        x += colWidths[3];
        doc.text(m.remark || '-', x, rowY, { width: colWidths[4], align: 'center' });

        y = rowY + 18;
      });

      doc.moveTo(leftX, y).lineTo(leftX + colWidths.reduce((a, b) => a + b, 0), y).stroke();
      y += 20;

      if (subjectCount > 0) {
        const avg = (totalScore / subjectCount).toFixed(2);
        doc.font('Helvetica-Bold').fontSize(11);
        doc.text(`Average Score: ${avg}`, leftX, y);
        y += 18;
        doc.text(`Total Subjects: ${subjectCount}`, leftX, y);
      }

      doc.end();
    });
  }
}

module.exports = new PdfService();
