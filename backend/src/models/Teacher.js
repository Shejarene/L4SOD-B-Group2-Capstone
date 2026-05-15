module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    staffNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    qualification: {
      type: DataTypes.STRING(255),
    },
    specialization: {
      type: DataTypes.STRING(255),
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
    },
    address: {
      type: DataTypes.TEXT,
    },
    employmentDate: {
      type: DataTypes.DATEONLY,
    },
    employmentStatus: {
      type: DataTypes.ENUM('active', 'on_leave', 'terminated', 'resigned'),
      defaultValue: 'active',
    },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
    },
  });

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Teacher.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
    Teacher.hasMany(models.SubjectAllocation, { foreignKey: 'teacherId', as: 'subjectAllocations' });
    Teacher.hasMany(models.LeaveRequest, { foreignKey: 'teacherId', as: 'leaveRequests' });
  };

  return Teacher;
};
