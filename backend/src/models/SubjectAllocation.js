module.exports = (sequelize, DataTypes) => {
  const SubjectAllocation = sequelize.define('SubjectAllocation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  SubjectAllocation.associate = (models) => {
    SubjectAllocation.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
    SubjectAllocation.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    SubjectAllocation.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    SubjectAllocation.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
  };

  return SubjectAllocation;
};
