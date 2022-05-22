const mongoose = require('mongoose');

const { STATUS } = require('../constants/task-status');

const Task = new mongoose.Schema({
  _id: { type: String, required: true },
  publicId: { type: String, required: true },

  description: { type: String, required: false },
  status: { type: String, required: true, enum: Object.values(STATUS), default: STATUS.CREATED },

  fee: { type: Number, required: false },
  cost: { type: Number, required: false },

  creator: { type: String, required: false },
  assignee: { type: String, required: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const model = mongoose.model('task', Task);

module.exports = model;
