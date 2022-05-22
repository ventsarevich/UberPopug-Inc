const monk = require('monk');

const AuditLog = require('../schemas/audit-log');

const create = async (auditLog) => AuditLog.create({ ...auditLog, _id: monk.id().toHexString() });

const find = async (query = {}) => AuditLog.find(query);

const update = async (query, payload) => AuditLog.updateMany(query, { $set: payload });

module.exports = {
  create,
  find,
  update
};
