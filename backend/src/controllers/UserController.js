const userService = require('../services/UserService');
const response = require('../utils/response');

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    response.created(res, user, 'User created successfully');
  } catch (err) { next(err); }
};

const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers(req.query);
    response.paginated(res, result.data, result.meta.total, result.meta.page, result.meta.perPage);
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    response.success(res, user);
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    response.success(res, user, 'User updated successfully');
  } catch (err) { next(err); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    response.success(res, user, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`);
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    response.success(res, null, 'User deleted successfully');
  } catch (err) { next(err); }
};

const createStudentAccount = async (req, res, next) => {
  try {
    const result = await userService.createStudentAccount(req.body);
    response.created(res, result, 'Student account created successfully');
  } catch (err) { next(err); }
};

const createTeacherAccount = async (req, res, next) => {
  try {
    const result = await userService.createTeacherAccount(req.body);
    response.created(res, result, 'Teacher account created successfully');
  } catch (err) { next(err); }
};

const createParentAccount = async (req, res, next) => {
  try {
    const result = await userService.createParentAccount(req.body);
    response.created(res, result, 'Parent account created successfully');
  } catch (err) { next(err); }
};

module.exports = {
  createUser, getUsers, getUserById, updateUser,
  toggleUserStatus, deleteUser, createStudentAccount,
  createTeacherAccount, createParentAccount,
};
