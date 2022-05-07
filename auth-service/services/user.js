const monk = require('monk');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const User = require('../schemas/user');

const exists = async (query) => User.exists(query);

const find = async (query = {}) => User.find(query);

const findOne = async (query = {}) => {
  if (query.password) {
    query.password = crypto.createHash('sha256').update(query.password).digest('hex');
  }

  return User.findOne(query);
};

const findById = async (id) => User.findOne({ _id: id });

const create = async (user) => {
  const passwordHash = crypto.createHash('sha256').update(user.password).digest('hex');

  return User.create({
    ...user,
    _id: monk.id().toHexString(),
    publicId: uuidv4(),
    password: passwordHash
  });
};

const update = async (user) => User.updateOne({ _id: user._id }, { $set: user });

const remove = async (id) => User.deleteOne({ _id: id });

module.exports = {
  find,
  findOne,
  findById,
  exists,
  create,
  remove,
  update
};