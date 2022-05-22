const monk = require('monk');

const User = require('../schemas/user');

const create = async (user) => {
  console.log({ ...user, _id: monk.id().toHexString() });
  return User.create({ ...user, _id: monk.id().toHexString() });
};

const update = async (query, payload) => User.updateOne(query, { $set: payload });

const remove = async (publicId) => User.deleteOne({ publicId });

const find = async (query = {}) => User.find(query);

const findOne = async (query = {}) => User.findOne(query);

const distinct = async (field, query = {}) => User.distinct(field, query);

module.exports = {
  create,
  update,
  remove,
  find,
  findOne,
  distinct
};
