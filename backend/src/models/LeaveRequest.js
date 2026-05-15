module.exports = (sequelize, DataTypes) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('sick', 'annual', 'personal', 'maternity', 'paternity', 'other'),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    approvedBy: {
      type: DataTypes.UUID,
    },
    approvedAt: {
      type: DataTypes.DATE,
    },
  });

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
  };

  return LeaveRequest;
};
