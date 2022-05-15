const monk = require('monk');
const { v4: uuidv4 } = require('uuid');

const Task = require('../schemas/task');

const find = async (query = {}) => Task.find(query);

const findById = async (id) => Task.findOne({ _id: id });

const create = async (task) => Task.create({
  ...task,
  _id: monk.id().toHexString(),
  publicId: uuidv4(),
  jiraId: Math.floor(Math.random() * 9000) + 1000
});

const update = async (task) => Task.updateOne({ _id: task._id }, { $set: task });

module.exports = {
  find,
  create,
  findById,
  update
};
