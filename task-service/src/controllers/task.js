const { ROLE } = require('../constants/role');
const taskService = require('../services/task');
const taskOperations = require('../operations/task');
const userOperations = require('../operations/user');
const { STATUS } = require('../constants/status');

const getTasks = async (ctx) => {
  const currentUser = ctx.session.user;

  const tasks = await taskOperations.getTasks(currentUser);
  const users = await userOperations.usersForAssign(currentUser);
  const shuffle = currentUser.role !== ROLE.USER;

  return ctx.render('home', { tasks, users, shuffle, currentUserId: currentUser.publicId });
};

const createTask = async (ctx) => {
  const payload = ctx.request.body;
  const creator = ctx.session.user.publicId;

  await taskOperations.createTask({ ...payload, creator });

  return ctx.redirect('/home');
};

const updateTask = async (ctx) => {
  const payload = ctx.request.body;

  await taskOperations.updateTask(payload);

  return ctx.redirect('/home');
};

const shuffleTask = async (ctx) => {
  await taskOperations.shuffleTask(ctx.session.user.username);

  return ctx.redirect('/home');
};

const completeTask = async (ctx) => {
  const payload = ctx.request.body;
  const currentUser = ctx.session.user;

  const task = await taskService.findById(payload._id);
  if (!task) ctx.throw(404, 'Task not found');
  if (task.assignee !== currentUser.publicId) ctx.throw(403, 'You have no rights to edit this task');
  if (task.status === STATUS.COMPLETED) ctx.throw(403, 'This task has already been completed');

  await taskOperations.completeTask(payload._id, task.publicId);

  return ctx.redirect('/home');
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  shuffleTask,
  completeTask
};