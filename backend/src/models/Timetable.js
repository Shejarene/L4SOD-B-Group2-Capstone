module.exports = (sequelize, DataTypes) => {
  const Timetable = sequelize.define('Timetable', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 6 },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING(50),
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('regular', 'exam'),
      defaultValue: 'regular',
    },
  });

  Timetable.associate = (models) => {
    Timetable.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Timetable.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
    Timetable.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Timetable.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
  };

  return Timetable;
};
