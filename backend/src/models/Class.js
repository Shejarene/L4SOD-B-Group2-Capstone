module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    section: {
      type: DataTypes.STRING(10),
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  Class.associate = (models) => {
    Class.belongsTo(models.Level, { foreignKey: 'levelId', as: 'level' });
    Class.belongsTo(models.Trade, { foreignKey: 'tradeId', as: 'trade' });
    Class.hasMany(models.Student, { foreignKey: 'classId', as: 'students' });
    Class.hasMany(models.Subject, { foreignKey: 'classId', as: 'subjects' });
    Class.hasMany(models.FeeStructure, { foreignKey: 'classId', as: 'feeStructures' });
    Class.hasMany(models.Attendance, { foreignKey: 'classId', as: 'attendance' });
    Class.hasMany(models.Timetable, { foreignKey: 'classId', as: 'timetables' });
    Class.hasMany(models.SubjectAllocation, { foreignKey: 'classId', as: 'subjectAllocations' });
    Class.hasMany(models.Mark, { foreignKey: 'classId', as: 'marks' });
    Class.hasMany(models.Exam, { foreignKey: 'classId', as: 'exams' });
  };

  return Class;
};
