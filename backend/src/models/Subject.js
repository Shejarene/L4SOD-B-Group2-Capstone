module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
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
    },
    type: {
      type: DataTypes.ENUM('core', 'elective', 'practical'),
      defaultValue: 'core',
    },
    coefficient: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });

  Subject.associate = (models) => {
    Subject.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Subject.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
    Subject.hasMany(models.SubjectAllocation, { foreignKey: 'subjectId', as: 'allocations' });
    Subject.hasMany(models.Mark, { foreignKey: 'subjectId', as: 'marks' });
    Subject.hasMany(models.Timetable, { foreignKey: 'subjectId', as: 'timetables' });
  };

  return Subject;
};
