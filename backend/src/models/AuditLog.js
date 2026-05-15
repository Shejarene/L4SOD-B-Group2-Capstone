module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING(100),
    },
    entityId: {
      type: DataTypes.UUID,
    },
    details: {
      type: DataTypes.JSONB,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
    },
    userAgent: {
      type: DataTypes.TEXT,
    },
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return AuditLog;
};
