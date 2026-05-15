module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define('Section', {
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
  });

  Section.associate = (models) => {
    Section.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Section.hasMany(models.Student, { foreignKey: 'sectionId', as: 'students' });
    Section.hasMany(models.Timetable, { foreignKey: 'sectionId', as: 'timetables' });
  };

  return Section;
};
