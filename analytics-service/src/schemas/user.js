const mongoose = require('mongoose');

const { ROLE } = require('../constants/role');
const { USER_STATUS } = require('../constants/user-status');

const User = new mongoose.Schema({
  _id: { type: String, required: true },
  publicId: { type: String, required: true },
  username: { type: String, required: false },
  email: { type: String, required: false },
  balance: { type: Number, required: true, default: 0 },
  status: { type: String, required: true, enum: Object.values(USER_STATUS), default: USER_STATUS.ACTIVE },
  role: { type: String, enum: Object.values(ROLE), required: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const model = mongoose.model('user', User);

module.exports = model;
