const config = require('../../config');
const { ROLE } = require('../../constants/role');

const isAuthenticated = async (ctx, next) => {
  if (!ctx.session.user) return ctx.redirect(`${config.SSO_SERVER_URL}?client_id=${config.CLIENT_ID}`);
  if (ctx.session.user.role !== ROLE.ADMIN) return ctx.throw(401, 'You have no rights');
  return next();
};

module.exports = isAuthenticated;
