const monk = require('monk');

const Task = require('../schemas/task');

const find = async (query = {}) => Task.find(query);

const findOne = async (query = {}) => Task.findOne(query);

const exists = async (query = {}) => Task.exists(query);

const findById = async (id) => Task.findOne({ _id: id });

const create = async (payload) => Task.create({
  ...payload,
  _id: monk.id().toHexString(),
  fee: Math.floor(Math.random() * 10) + 10,
  cost: Math.floor(Math.random() * 20) + 20
});

const update = async (task) => Task.updateOne({ _id: task._id }, { $set: task });

module.exports = {
  find,
  exists,
  findOne,
  create,
  findById,
  update
};
