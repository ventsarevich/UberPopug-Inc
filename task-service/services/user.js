const monk = require('monk');

const User = require('../schemas/user');

const create = async (user) => User.create({ ...user, _id: monk.id().toHexString() });

const update = async (user) => User.updateOne({ publicId: user.publicId }, { $set: user });

const remove = async (publicId) => User.deleteOne({ publicId });

const find = async (query = {}) => User.find(query);

const distinct = async (field, query = {}) => User.distinct(field, query);

module.exports = {
  create,
  update,
  remove,
  find,
  distinct
};