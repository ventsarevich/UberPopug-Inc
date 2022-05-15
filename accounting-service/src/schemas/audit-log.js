const mongoose = require('mongoose');

const { TYPE } = require('../constants/audit-log-type');
const { STATUS } = require('../constants/audit-log-status');

const AuditLog = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  taskId: { type: String, required: true },
  type: { type: String, required: true, enum: Object.values(TYPE) },
  status: { type: String, required: true, enum: Object.values(STATUS), default: STATUS.CREATED }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const model = mongoose.model('audit-log', AuditLog);

module.exports = model;
