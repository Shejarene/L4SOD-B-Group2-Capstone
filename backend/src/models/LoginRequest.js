module.exports = (sequelize, DataTypes) => {
  const LoginRequest = sequelize.define('LoginRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    requestedRole: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    adminRemark: {
      type: DataTypes.TEXT,
    },
    reviewedBy: {
      type: DataTypes.UUID,
    },
    reviewedAt: {
      type: DataTypes.DATE,
    },
  });

  return LoginRequest;
};
