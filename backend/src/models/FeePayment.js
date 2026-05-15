module.exports = (sequelize, DataTypes) => {
  const FeePayment = sequelize.define('FeePayment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    receiptNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'bank_transfer', 'mobile_money', 'cheque', 'online'),
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    reference: {
      type: DataTypes.STRING(100),
    },
    notes: {
      type: DataTypes.TEXT,
    },
    receivedBy: {
      type: DataTypes.UUID,
    },
  });

  FeePayment.associate = (models) => {
    FeePayment.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    FeePayment.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
  };

  return FeePayment;
};
