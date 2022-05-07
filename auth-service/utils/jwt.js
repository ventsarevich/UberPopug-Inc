const jwt = require('jsonwebtoken');

const verifyToken = (payload, secret) => jwt.verify(payload, secret);
const signToken = (payload, secret) => jwt.sign(payload, secret);

module.exports = {
  verifyToken,
  signToken
};
