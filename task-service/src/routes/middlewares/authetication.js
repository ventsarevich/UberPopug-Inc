const config = require('../../config');

const isAuthenticated = async (ctx, next) => {
  return (!ctx.session.user)
    ? ctx.redirect(`${config.SSO_SERVER_URL}?client_id=${config.CLIENT_ID}`)
    : next();
};

module.exports = isAuthenticated;
