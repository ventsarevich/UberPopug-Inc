const { v4: uuidv4 } = require('uuid');
const { validateEvent } = require('@ventsarevich/shema-registry');

const userService = require('../services/user');
const { TOPIC } = require('../constants/topic');
const { sendMessages } = require('../queue/kafka');
const { CUD_EVENT, BUSINESS_EVENT } = require('../constants/event');

const deleteUser = async (_id) => {
  const user = await userService.findById(_id);
  if (!user) return null;

  const deletedUser = await userService.remove(_id);

  const event = {
    id: uuidv4(),
    version: 1,
    time: new Date(),
    producer: 'auth-service-producer',
    type: CUD_EVENT.USER_DELETED,
    data: { publicId: user.publicId }
  };

  const { isValid, error } = validateEvent(event);
  if (isValid) {
    await sendMessages(TOPIC.USERS_STREAM, [event]);
  } else {
    console.log(`${CUD_EVENT.USER_DELETED} send is rejected`, error);
  }

  return deletedUser;
};

const updateUser = async (payload) => {
  const user = await userService.findById(payload._id);
  if (!user) return null;

  await userService.update(payload);

  console.log(user.role);
  console.log(payload.role);
  if (user.role !== payload.role) {
    const event = {
      id: uuidv4(),
      version: 1,
      time: new Date(),
      producer: 'auth-service-producer',
      type: BUSINESS_EVENT.USER_ROLE_CHANGED,
      data: { publicId: user.publicId, role: payload.role }
    };

    const { isValid, error } = validateEvent(event);
    if (isValid) {
      await sendMessages(TOPIC.USERS_ROLE_CHANGED, [event]);
    } else {
      console.log(`${BUSINESS_EVENT.USER_ROLE_CHANGED} send is rejected`, error);
    }
  }

  return user;
};

const createUser = async ({ password, confirmationPassword, email, username }) => {
  if (password !== confirmationPassword) return { error: 'Passwords don\'t match' };

  const exists = await userService.exists({ username });
  if (exists) return { error: 'Username is already in use' };

  const createdUser = await userService.create({ username, password, email });

  const event = {
    id: uuidv4(),
    version: 1,
    time: new Date(),
    producer: 'auth-service-producer',
    type: CUD_EVENT.USER_CREATED,
    data: {
      publicId: createdUser.publicId,
      role: createdUser.role,
      email: createdUser.email,
      username: createdUser.username
    }
  };

  const { isValid, error } = validateEvent(event);
  if (isValid) {
    await sendMessages(TOPIC.USERS_STREAM, [event]);
  } else {
    console.log(`${CUD_EVENT.USER_CREATED} send is rejected`, error);
  }

  return createdUser;
};

module.exports = {
  deleteUser,
  updateUser,
  createUser
};
