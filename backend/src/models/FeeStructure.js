module.exports = (sequelize, DataTypes) => {
  const FeeStructure = sequelize.define('FeeStructure', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('tuition', 'transport', 'boarding', 'library', 'sports', 'other'),
      allowNull: false,
    },
    frequency: {
      type: DataTypes.ENUM('termly', 'yearly', 'one_time'),
      defaultValue: 'termly',
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
    isMandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  FeeStructure.associate = (models) => {
    FeeStructure.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    FeeStructure.hasMany(models.Invoice, { foreignKey: 'feeStructureId', as: 'invoices' });
  };

  return FeeStructure;
};
