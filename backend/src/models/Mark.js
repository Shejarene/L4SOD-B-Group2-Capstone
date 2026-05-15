module.exports = (sequelize, DataTypes) => {
  const Mark = sequelize.define('Mark', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    score: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING(2),
    },
    remark: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected'),
      defaultValue: 'draft',
    },
    approvedBy: {
      type: DataTypes.UUID,
    },
    approvedAt: {
      type: DataTypes.DATE,
    },
  });

  Mark.associate = (models) => {
    Mark.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Mark.belongsTo(models.Exam, { foreignKey: 'examId', as: 'exam' });
    Mark.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Mark.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
  };

  return Mark;
};
