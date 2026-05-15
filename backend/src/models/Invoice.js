module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.ENUM('pending', 'partial', 'paid', 'overdue', 'cancelled'),
      defaultValue: 'pending',
    },
    academicYear: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    term: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Invoice.belongsTo(models.FeeStructure, { foreignKey: 'feeStructureId', as: 'feeStructure' });
    Invoice.hasMany(models.FeePayment, { foreignKey: 'invoiceId', as: 'payments' });
  };

  return Invoice;
};
