const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const hash = await bcrypt.hash('admin123', 12);

    await queryInterface.bulkInsert('Users', [
      { id: '10000001-0000-0000-0000-000000000001', email: 'admin@school.com', password: hash, firstName: 'Super', lastName: 'Admin', phone: '+250780000001', role: 'super_admin', isActive: true, createdAt: now, updatedAt: now },
      { id: '10000001-0000-0000-0000-000000000002', email: 'dos@school.com', password: hash, firstName: 'Jean', lastName: 'Dos', phone: '+250780000002', role: 'dos', isActive: true, createdAt: now, updatedAt: now },
      { id: '10000001-0000-0000-0000-000000000003', email: 'dm@school.com', password: hash, firstName: 'Marie', lastName: 'Master', phone: '+250780000003', role: 'discipline_master', isActive: true, createdAt: now, updatedAt: now },
      { id: '10000001-0000-0000-0000-000000000004', email: 'accountant@school.com', password: hash, firstName: 'Peter', lastName: 'Accountant', phone: '+250780000004', role: 'accountant', isActive: true, createdAt: now, updatedAt: now },
      { id: '10000001-0000-0000-0000-000000000005', email: 'secretary@school.com', password: hash, firstName: 'Alice', lastName: 'Secretary', phone: '+250780000005', role: 'admin', isActive: true, createdAt: now, updatedAt: now },
      { id: '10000001-0000-0000-0000-000000000006', email: 'teacher.sod@school.com', password: hash, firstName: 'Patrick', lastName: 'Nsengimana', phone: '+250780000006', role: 'teacher', isActive: true, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Levels', [
      { id: '20000001-0000-0000-0000-000000000001', number: 3, name: 'Level 3', description: 'Foundation Level', createdAt: now, updatedAt: now },
      { id: '20000001-0000-0000-0000-000000000002', number: 4, name: 'Level 4', description: 'Intermediate Level', createdAt: now, updatedAt: now },
      { id: '20000001-0000-0000-0000-000000000003', number: 5, name: 'Level 5', description: 'Advanced Level', createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Trades', [
      { id: '30000001-0000-0000-0000-000000000001', code: 'SOD', name: 'SOD', fullName: 'Software Development', description: 'Software Development trade', createdAt: now, updatedAt: now },
      { id: '30000001-0000-0000-0000-000000000002', code: 'NIT', name: 'NIT', fullName: 'Networking and Internet Technology', description: 'Networking and IT trade', createdAt: now, updatedAt: now },
      { id: '30000001-0000-0000-0000-000000000003', code: 'MMP', name: 'MMP', fullName: 'Multimedia Production', description: 'Multimedia Production trade', createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Classes', [
      { id: '40000001-0000-0000-0000-000000000001', name: 'L3 SOD A', code: 'L3-SOD-A', section: 'A', levelId: '20000001-0000-0000-0000-000000000001', tradeId: '30000001-0000-0000-0000-000000000001', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000002', name: 'L3 SOD B', code: 'L3-SOD-B', section: 'B', levelId: '20000001-0000-0000-0000-000000000001', tradeId: '30000001-0000-0000-0000-000000000001', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000003', name: 'L3 NIT', code: 'L3-NIT', section: null, levelId: '20000001-0000-0000-0000-000000000001', tradeId: '30000001-0000-0000-0000-000000000002', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000004', name: 'L3 MMP', code: 'L3-MMP', section: null, levelId: '20000001-0000-0000-0000-000000000001', tradeId: '30000001-0000-0000-0000-000000000003', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000005', name: 'L4 SOD A', code: 'L4-SOD-A', section: 'A', levelId: '20000001-0000-0000-0000-000000000002', tradeId: '30000001-0000-0000-0000-000000000001', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000006', name: 'L4 SOD B', code: 'L4-SOD-B', section: 'B', levelId: '20000001-0000-0000-0000-000000000002', tradeId: '30000001-0000-0000-0000-000000000001', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000007', name: 'L4 NIT', code: 'L4-NIT', section: null, levelId: '20000001-0000-0000-0000-000000000002', tradeId: '30000001-0000-0000-0000-000000000002', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000008', name: 'L4 MMP', code: 'L4-MMP', section: null, levelId: '20000001-0000-0000-0000-000000000002', tradeId: '30000001-0000-0000-0000-000000000003', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000009', name: 'L5 SOD', code: 'L5-SOD', section: null, levelId: '20000001-0000-0000-0000-000000000003', tradeId: '30000001-0000-0000-0000-000000000001', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000010', name: 'L5 NIT', code: 'L5-NIT', section: null, levelId: '20000001-0000-0000-0000-000000000003', tradeId: '30000001-0000-0000-0000-000000000002', createdAt: now, updatedAt: now },
      { id: '40000001-0000-0000-0000-000000000011', name: 'L5 MMP', code: 'L5-MMP', section: null, levelId: '20000001-0000-0000-0000-000000000003', tradeId: '30000001-0000-0000-0000-000000000003', createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Subjects', [
      { id: '50000001-0000-0000-0000-000000000001', name: 'Mathematics', code: 'MATH', type: 'core', coefficient: 3, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000002', name: 'English', code: 'ENG', type: 'core', coefficient: 3, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000003', name: 'Kinyarwanda', code: 'KIN', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000004', name: 'Physics', code: 'PHY', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000005', name: 'Chemistry', code: 'CHEM', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000006', name: 'Biology', code: 'BIO', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000007', name: 'Geography', code: 'GEO', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000008', name: 'History', code: 'HIS', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000009', name: 'Entrepreneurship', code: 'ENT', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000010', name: 'ICT (Computer Science)', code: 'ICT', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000011', name: 'French', code: 'FR', type: 'core', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000012', name: 'Kiswahili', code: 'SWA', type: 'core', coefficient: 1, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000013', name: 'General Studies & Communication', code: 'GSC', type: 'core', coefficient: 1, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000014', name: 'Physical Education & Sports', code: 'PES', type: 'core', coefficient: 1, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000015', name: 'Civic Education & Ethics', code: 'CIV', type: 'core', coefficient: 1, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000016', name: 'Web Development', code: 'WEB', type: 'practical', coefficient: 3, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000017', name: 'Mobile App Development', code: 'MOB', type: 'practical', coefficient: 3, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000018', name: 'Database Management', code: 'DBM', type: 'practical', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000019', name: 'Network Administration', code: 'NET', type: 'practical', coefficient: 3, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000020', name: 'Cybersecurity', code: 'SEC', type: 'practical', coefficient: 2, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000021', name: 'Graphic Design', code: 'GRD', type: 'practical', coefficient: 3, createdAt: now, updatedAt: now },
      { id: '50000001-0000-0000-0000-000000000022', name: 'Video & Animation Production', code: 'VID', type: 'practical', coefficient: 3, createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Departments', [
      { id: '60000001-0000-0000-0000-000000000001', name: 'General Studies', code: 'GEN', description: 'Core academic subjects', createdAt: now, updatedAt: now },
      { id: '60000001-0000-0000-0000-000000000002', name: 'Software Development', code: 'SOD', description: 'Software Development Department', createdAt: now, updatedAt: now },
      { id: '60000001-0000-0000-0000-000000000003', name: 'Networking & IT', code: 'NIT', description: 'Networking and Internet Technology Department', createdAt: now, updatedAt: now },
      { id: '60000001-0000-0000-0000-000000000004', name: 'Multimedia Production', code: 'MMP', description: 'Multimedia Production Department', createdAt: now, updatedAt: now },
    ]);

    await queryInterface.bulkInsert('Settings', [
      { id: '70000001-0000-0000-0000-000000000001', key: 'school_name', value: JSON.stringify('Rwanda TVET Institute of Technology'), createdAt: now, updatedAt: now },
      { id: '70000001-0000-0000-0000-000000000002', key: 'school_address', value: JSON.stringify('KG 123 Avenue, Kigali, Rwanda'), createdAt: now, updatedAt: now },
      { id: '70000001-0000-0000-0000-000000000003', key: 'academic_year', value: JSON.stringify('2025/2026'), createdAt: now, updatedAt: now },
      { id: '70000001-0000-0000-0000-000000000004', key: 'current_term', value: JSON.stringify('1'), createdAt: now, updatedAt: now },
      { id: '70000001-0000-0000-0000-000000000005', key: 'grading_scale', value: JSON.stringify([{min:80,max:100,grade:'A',remark:'Excellent'},{min:70,max:79,grade:'B',remark:'Very Good'},{min:60,max:69,grade:'C',remark:'Good'},{min:50,max:59,grade:'D',remark:'Fair'},{min:40,max:49,grade:'E',remark:'Poor'},{min:0,max:39,grade:'F',remark:'Fail'}]), createdAt: now, updatedAt: now },
      { id: '70000001-0000-0000-0000-000000000006', key: 'school_country', value: JSON.stringify('Rwanda'), createdAt: now, updatedAt: now },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Settings', null, {});
    await queryInterface.bulkDelete('Departments', null, {});
    await queryInterface.bulkDelete('Subjects', null, {});
    await queryInterface.bulkDelete('Trades', null, {});
    await queryInterface.bulkDelete('Levels', null, {});
    await queryInterface.bulkDelete('Classes', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
