const mongoose = require('mongoose');

const { STATUS } = require('../constants/status');

const Task = new mongoose.Schema({
  _id: { type: String, required: true },
  publicId: { type: String, required: true },

  description: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(STATUS), default: STATUS.CREATED },

  creator: { type: String, required: true },
  assignee: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const model = mongoose.model('task', Task);

module.exports = model;
