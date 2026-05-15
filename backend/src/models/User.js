const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    role: {
      type: DataTypes.ENUM(
        'super_admin', 'admin', 'principal', 'dos',
        'discipline_master', 'accountant', 'teacher', 'student', 'parent'
      ),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    profilePicture: {
      type: DataTypes.STRING(500),
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    refreshToken: {
      type: DataTypes.TEXT,
    },
  }, {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
    defaultScope: {
      attributes: { exclude: ['password', 'refreshToken'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password', 'refreshToken'] },
      },
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Student, { foreignKey: 'userId', as: 'studentProfile' });
    User.hasOne(models.Teacher, { foreignKey: 'userId', as: 'teacherProfile' });
    User.hasOne(models.Parent, { foreignKey: 'userId', as: 'parentProfile' });
  };

  User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.refreshToken;
    return values;
  };

  return User;
};
