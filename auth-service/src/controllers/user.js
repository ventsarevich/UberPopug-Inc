const { ROLE } = require('../constants/role');
const userService = require('../services/user');
const userOperations = require('../operations/user');
const instanceService = require('../services/instance');

const getUsers = async (ctx) => {
  const users = await userService.find();
  const roles = Object.values(ROLE);
  const currentUserId = ctx.session.user._id;

  return ctx.render('/user', { users, roles, currentUserId });
};

const deleteUser = async (ctx) => {
  const { _id } = ctx.request.body;

  const result = await userOperations.deleteUser(_id);

  return result === null
    ? ctx.throw(400, 'Deleted User not found')
    : ctx.redirect('/user');
};

const updateUser = async (ctx) => {
  const payload = ctx.request.body;

  const result = await userOperations.updateUser(payload);

  return result === null
    ? ctx.throw(400, 'Updated User not found')
    : ctx.redirect('/user');
};

const createUser = async (ctx) => {
  const payload = ctx.request.body;
  const { client_id: clientId } = ctx.query;

  if (!clientId) return ctx.throw(400, 'Client ID is not provided');

  const instance = await instanceService.findById(clientId);
  if (!instance) return ctx.throw(400, 'This app is not registered in auth service');

  const createdUser = await userOperations.createUser(payload);

  return createdUser.error
    ? ctx.render('signup', { ...payload, error: createdUser.error })
    : ctx.redirect(`/sso/login?client_id=${clientId}`);
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUsers
};