module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  Department.associate = (models) => {
    Department.hasMany(models.Teacher, { foreignKey: 'departmentId', as: 'teachers' });
    Department.hasMany(models.Subject, { foreignKey: 'departmentId', as: 'subjects' });
  };

  return Department;
};
