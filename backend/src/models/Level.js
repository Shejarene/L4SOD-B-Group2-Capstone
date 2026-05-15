module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define('Level', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  Level.associate = (models) => {
    Level.hasMany(models.Class, { foreignKey: 'levelId', as: 'classes' });
  };

  return Level;
};
