const { v4: uuidv4 } = require('uuid');

const config = require('../config');
const userService = require('../services/user');
const instanceService = require('../services/instance');
const redisClient = require('../database/redis-client');
const { verifyToken, signToken } = require('../utils/jwt');

const checkLogin = async (ctx) => {
  const { client_id: clientId } = ctx.query;

  if (!clientId) return ctx.throw(400, 'Client ID is not provided');

  const instance = await instanceService.findById(clientId);
  if (!instance) return ctx.throw(400, 'This app is not registered in auth service');

  if (ctx.session.user != null) {
    const ssoToken = uuidv4();

    await redisClient.setValue(ssoToken, { clientId, userId: ctx.session.user._id }, 60);

    return ctx.redirect(`${instance.url}?ssoToken=${ssoToken}`);
  }

  return ctx.render('login', { username: null, password: null, error: null, message: null });
};

const login = async (ctx) => {
  const { username, password } = ctx.request.body;
  const { client_id: clientId } = ctx.query;

  const user = await userService.findOne({ username, password });

  if (!user) return ctx.render('login', { error: 'User not found', username, password, message: null });

  if (!clientId) return ctx.throw(400, 'Client ID is not provided');

  const instance = await instanceService.findById(clientId);
  if (!instance) return ctx.throw(400, 'This app is not registered in auth service');

  const ssoToken = uuidv4();
  await redisClient.setValue(ssoToken, { clientId, userId: user._id }, 60);

  ctx.session.user = user;

  return clientId === config.CLIENT_ID
    ? ctx.redirect(instance.url)
    : ctx.redirect(`${instance.url}?ssoToken=${ssoToken}`);
};

const signUp = async (ctx) => ctx.render('signup', {
  email: null,
  username: null,
  password: null,
  confirmationPassword: null,
  error: null
});

const verify = async (ctx) => {
  const { clientId } = ctx.request.body;
  const header = ctx.headers.authorization;

  try {
    const instance = await instanceService.findById(clientId);
    if (!instance) {
      ctx.body = { error: 'ClientId not found' };
      return;
    }

    const { ssoToken } = await verifyToken(header.split(' ')[1], instance.secret);

    const tokenPayload = await redisClient.getValue(ssoToken);
    if (!tokenPayload || tokenPayload.clientId !== clientId) {
      ctx.body = { error: 'Provided token is not valid' };
      return;
    }

    const user = await userService.findById(tokenPayload.userId);

    const jwtToken = await signToken(
      { publicId: user.publicId, username: user.username, role: user.role },
      instance.secret
    );

    ctx.body = { token: jwtToken };
  } catch (error) {
    console.log('error', error);
    ctx.body = { error: 'Provided token is not valid' };
  }
};

module.exports = {
  login,
  checkLogin,
  signUp,
  verify
};