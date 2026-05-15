module.exports = (sequelize, DataTypes) => {
  const Trade = sequelize.define('Trade', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  Trade.associate = (models) => {
    Trade.hasMany(models.Class, { foreignKey: 'tradeId', as: 'classes' });
  };

  return Trade;
};
