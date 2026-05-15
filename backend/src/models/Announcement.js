module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetRoles: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    targetClassIds: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal',
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
  });

  Announcement.associate = (models) => {
    Announcement.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Announcement;
};
