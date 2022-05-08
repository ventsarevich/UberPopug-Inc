const axios = require('axios');
const config = require('../../config');
const { signToken, verifyToken } = require('../../utils/jwt');

const verifyAccessToken = async (ctx, next) => {
  const { ssoToken } = ctx.query;

  if (!ssoToken) return next();

  const decodeSsoToken = await signToken({ ssoToken }, config.CLIENT_SECRET);

  const response = await axios.post(
    config.SSO_SERVER_AUTHENTICATION_URL,
    { clientId: config.CLIENT_ID },
    { headers: { Authorization: 'Bearer ' + decodeSsoToken } }
  );

  if (response.data.error) {
    console.log(response.data.error);
    return ctx.throw(400, response.data.error);
  }

  ctx.session.user = await verifyToken(response.data.token, config.CLIENT_SECRET);
  ctx.redirect('/home');
};

module.exports = verifyAccessToken;
