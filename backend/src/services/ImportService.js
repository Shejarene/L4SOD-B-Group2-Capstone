const bcrypt = require('bcryptjs');
const { User, Student, Class, Section, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const { generateAdmissionNumber } = require('../utils/helpers');

class ImportService {
  async importStudents(entries) {
    const results = { created: [], errors: [] };

    for (let i = 0; i < entries.length; i++) {
      const row = entries[i];
      const rowNum = i + 2;

      try {
        if (!row.firstName || !row.lastName) {
          results.errors.push({ row: rowNum, error: 'firstName and lastName are required' });
          continue;
        }

        const cls = await Class.findOne({ where: { name: row.class } });
        if (row.class && !cls) {
          results.errors.push({ row: rowNum, error: `Class "${row.class}" not found` });
          continue;
        }

        const section = row.section
          ? await Section.findOne({ where: { name: row.section, classId: cls?.id } })
          : null;
        if (row.section && !section) {
          results.errors.push({ row: rowNum, error: `Section "${row.section}" not found` });
          continue;
        }

        const existingUser = await User.findOne({ where: { email: row.email } });
        if (existingUser) {
          results.errors.push({ row: rowNum, error: `Email "${row.email}" already exists` });
          continue;
        }

        const password = row.password || 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email || `student${Date.now()}_${i}@school.com`,
          phone: row.phone || null,
          password: hashedPassword,
          role: 'student',
          status: 'active',
        });

        const student = await Student.create({
          userId: user.id,
          admissionNumber: row.admissionNumber || generateAdmissionNumber(cls?.code || 'GEN', new Date().getFullYear().toString()),
          dateOfBirth: row.dateOfBirth || null,
          gender: row.gender || null,
          address: row.address || null,
          classId: cls?.id || null,
          sectionId: section?.id || null,
          status: 'active',
        });

        results.created.push({
          id: student.id,
          admissionNumber: student.admissionNumber,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        });
      } catch (err) {
        results.errors.push({ row: rowNum, error: err.message });
      }
    }

    return results;
  }
}

module.exports = new ImportService();
