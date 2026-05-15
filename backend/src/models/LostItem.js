module.exports = (sequelize, DataTypes) => {
  const LostItem = sequelize.define('LostItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    itemName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('electronics', 'clothing', 'books', 'stationery', 'money', 'jewelry', 'documents', 'other'),
      defaultValue: 'other',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dateLost: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contactInfo: {
      type: DataTypes.STRING(255),
    },
    imageUrl: {
      type: DataTypes.STRING(500),
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'resolved'),
      defaultValue: 'pending',
    },
    adminRemark: {
      type: DataTypes.TEXT,
    },
    resolvedAt: {
      type: DataTypes.DATE,
    },
    reportedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reviewedBy: {
      type: DataTypes.UUID,
    },
  });

  LostItem.associate = (models) => {
    LostItem.belongsTo(models.User, { foreignKey: 'reportedBy', as: 'reporter' });
    LostItem.belongsTo(models.User, { foreignKey: 'reviewedBy', as: 'reviewer' });
  };

  return LostItem;
};
