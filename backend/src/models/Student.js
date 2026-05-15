module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    admissionNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'graduated', 'suspended', 'expelled', 'withdrawn'),
      defaultValue: 'active',
    },
  });

  Student.associate = (models) => {
    Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Student.belongsTo(models.Level, { foreignKey: 'levelId', as: 'level' });
    Student.belongsTo(models.Trade, { foreignKey: 'tradeId', as: 'trade' });
    Student.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Student.belongsToMany(models.Parent, {
      through: 'StudentParents',
      foreignKey: 'studentId',
      as: 'parents',
    });
    Student.hasMany(models.Attendance, { foreignKey: 'studentId', as: 'attendance' });
    Student.hasMany(models.Mark, { foreignKey: 'studentId', as: 'marks' });
    Student.hasMany(models.FeePayment, { foreignKey: 'studentId', as: 'payments' });
    Student.hasMany(models.DisciplinaryRecord, { foreignKey: 'studentId', as: 'disciplinaryRecords' });
  };

  return Student;
};
