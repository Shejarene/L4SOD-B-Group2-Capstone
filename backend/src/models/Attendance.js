module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      allowNull: false,
    },
    remark: {
      type: DataTypes.TEXT,
    },
    takenBy: {
      type: DataTypes.UUID,
    },
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Attendance.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Attendance.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
  };

  return Attendance;
};
