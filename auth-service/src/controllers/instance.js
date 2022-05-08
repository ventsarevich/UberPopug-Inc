const instanceService = require('../services/instance');

const getInstances = async (ctx) => {
  const instances = await instanceService.find();

  return ctx.render('home', { instances });
};

const updateInstance = async (ctx) => {
  const payload = ctx.request.body;

  await instanceService.update(payload);

  return ctx.redirect('/home');
};

const deleteInstance = async (ctx) => {
  const { _id } = ctx.request.body;

  await instanceService.remove(_id);

  return ctx.redirect('/home');
};

const createInstance = async (ctx) => {
  const instance = ctx.request.body;

  await instanceService.create(instance);

  return ctx.redirect('/home');
};

module.exports = {
  getInstances,
  updateInstance,
  deleteInstance,
  createInstance
};