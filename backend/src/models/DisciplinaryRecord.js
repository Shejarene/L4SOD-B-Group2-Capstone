module.exports = (sequelize, DataTypes) => {
  const DisciplinaryRecord = sequelize.define('DisciplinaryRecord', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('positive', 'negative'),
      allowNull: false,
    },
    incident: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    action: {
      type: DataTypes.ENUM('warning', 'suspension', 'expulsion', 'counseling', 'commendation', 'other'),
    },
    actionDate: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.ENUM('open', 'resolved', 'closed'),
      defaultValue: 'open',
    },
    recordedBy: {
      type: DataTypes.UUID,
    },
    resolvedAt: {
      type: DataTypes.DATE,
    },
  });

  DisciplinaryRecord.associate = (models) => {
    DisciplinaryRecord.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
  };

  return DisciplinaryRecord;
};
