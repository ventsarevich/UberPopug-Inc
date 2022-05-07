const mongoose = require('mongoose');

const { ROLE } = require('../constants/role');

const User = new mongoose.Schema({
  _id: { type: String, required: true },
  publicId: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: Object.values(ROLE), required: true, default: ROLE.USER }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const model = mongoose.model('user', User);

module.exports = model;
