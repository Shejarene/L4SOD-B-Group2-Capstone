module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define('Exam', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('continuous_assessment', 'mid_term', 'final_exam', 'quiz'),
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    term: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weightage: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    startTime: {
      type: DataTypes.TIME,
    },
    endTime: {
      type: DataTypes.TIME,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'scheduled',
    },
  });

  Exam.associate = (models) => {
    Exam.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Exam.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Exam.hasMany(models.Mark, { foreignKey: 'examId', as: 'marks' });
  };

  return Exam;
};
