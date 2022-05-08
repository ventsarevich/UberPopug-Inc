const jwt = require('jsonwebtoken');

const verifyToken = async (payload, secret) => jwt.verify(payload, secret);
const signToken = async (payload, secret) => jwt.sign(payload, secret);

module.exports = {
  verifyToken,
  signToken
};
