module.exports = (sequelize, DataTypes) => {
  const Invite = sequelize.define('Invite', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(64),
      unique: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    usedBy: {
      type: DataTypes.UUID,
    },
    usedAt: {
      type: DataTypes.DATE,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Invite.associate = (models) => {
    Invite.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Invite;
};
