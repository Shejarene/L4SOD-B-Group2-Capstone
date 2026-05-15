module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define('Parent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    occupation: {
      type: DataTypes.STRING(255),
    },
    relationship: {
      type: DataTypes.ENUM('father', 'mother', 'guardian', 'other'),
    },
    address: {
      type: DataTypes.TEXT,
    },
  });

  Parent.associate = (models) => {
    Parent.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Parent.belongsToMany(models.Student, {
      through: 'StudentParents',
      foreignKey: 'parentId',
      as: 'children',
    });
  };

  return Parent;
};
