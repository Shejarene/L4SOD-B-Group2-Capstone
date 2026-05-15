const crypto = require('crypto');
const { Invite, User } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const response = require('../utils/response');
const userService = require('../services/UserService');

const createInvite = async (req, res, next) => {
  try {
    const { role, email } = req.body;
    if (!role) throw new AppError('Role is required', 400);
    const invite = await Invite.create({
      token: crypto.randomBytes(32).toString('hex'),
      role,
      email: email || null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: req.user.id,
    });
    response.created(res, invite, 'Invite link generated');
  } catch (err) { next(err); }
};

const getInvites = async (req, res, next) => {
  try {
    const invites = await Invite.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
    });
    response.success(res, invites);
  } catch (err) { next(err); }
};

const verifyInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ where: { token } });
    if (!invite) throw new AppError('Invalid invite token', 404);
    if (invite.used) throw new AppError('This invite has already been used', 400);
    if (invite.expiresAt && new Date() > invite.expiresAt) {
      throw new AppError('This invite has expired', 400);
    }
    response.success(res, { role: invite.role, email: invite.email });
  } catch (err) { next(err); }
};

const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { firstName, lastName, email, phone, password } = req.body;

    const invite = await Invite.findOne({ where: { token } });
    if (!invite) throw new AppError('Invalid invite token', 404);
    if (invite.used) throw new AppError('This invite has already been used', 400);
    if (invite.expiresAt && new Date() > invite.expiresAt) {
      throw new AppError('This invite has expired', 400);
    }
    if (invite.email && invite.email !== email) {
      throw new AppError(`This invite is for ${invite.email}`, 400);
    }

    let result;
    const userData = { firstName, lastName, email: email || invite.email, phone, password };

    switch (invite.role) {
      case 'teacher':
        result = await userService.createTeacherAccount(userData);
        break;
      case 'student':
        result = await userService.createStudentAccount(userData);
        break;
      case 'parent':
        result = await userService.createParentAccount(userData);
        break;
      default:
        const user = await userService.createUser({ ...userData, role: invite.role });
        result = { user };
    }

    await invite.update({ used: true, usedBy: result.user.id, usedAt: new Date() });
    response.created(res, { user: result.user }, 'Account created successfully');
  } catch (err) { next(err); }
};

module.exports = { createInvite, getInvites, verifyInvite, acceptInvite };
