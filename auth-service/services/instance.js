const monk = require('monk');

const Instance = require('../schemas/instance');

const find = async (query = {}) => Instance.find(query);

const findById = async (id) => Instance.findOne({ _id: id });

const create = async (instance) => Instance.create({ ...instance, _id: monk.id().toHexString() });

const update = async (instance) => Instance.updateOne({ _id: instance._id }, { $set: instance });

const remove = async (id) => Instance.deleteOne({ _id: id });

module.exports = {
  find,
  findById,
  create,
  update,
  remove
};