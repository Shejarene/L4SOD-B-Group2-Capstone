const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
  generateTokens(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
    return { accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }
    if (!user.isActive) {
      throw new AppError('Account is deactivated. Contact administrator.', 403);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }
    const tokens = this.generateTokens(user);
    await user.update({ refreshToken: tokens.refreshToken, lastLogin: new Date() });
    return { user: user.toJSON(), ...tokens };
  }

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await User.scope('withPassword').findByPk(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }
      const tokens = this.generateTokens(user);
      await user.update({ refreshToken: tokens.refreshToken });
      return { user: user.toJSON(), ...tokens };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ refreshToken: null });
    }
  }

  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      include: [
        { association: 'studentProfile' },
        { association: 'teacherProfile' },
        { association: 'parentProfile' },
      ],
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
  }
}

module.exports = new AuthService();
