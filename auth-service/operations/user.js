const userService = require('../services/user');
const { TOPIC } = require('../constants/topic');
const { sendMessages } = require('../queue/kafka');
const { CUD_EVENT, BUSINESS_EVENT } = require('../constants/event');

const deleteUser = async (_id) => {
  const user = await userService.findById(_id);
  if (!user) return null;

  const deletedUser = await userService.remove(_id);

  const event = {
    type: CUD_EVENT.USER_DELETED,
    data: { publicId: user.publicId }
  };

  await sendMessages(TOPIC.USERS_STREAM, [event]);

  return deletedUser;
};

const updateUser = async (payload) => {
  const user = await userService.findById(payload._id);
  if (!user) return null;

  const updatedUser = await userService.update(payload);

  if (user.role !== updatedUser.role) {
    const event = {
      type: BUSINESS_EVENT.USER_ROLE_CHANGED,
      data: { publicId: updatedUser.publicId, role: updatedUser.role }
    };

    await sendMessages(TOPIC.USERS, [event]);
  }

  return updatedUser;
};

const createUser = async ({ password, confirmationPassword, email, username }) => {
  if (password !== confirmationPassword) return { error: 'Passwords don\'t match' };

  const exists = await userService.exists({ username });
  if (exists) return { error: 'Username is already in use' };

  const createdUser = await userService.create({ username, password, email });

  const event = {
    type: CUD_EVENT.USER_CREATED,
    data: {
      publicId: createdUser.publicId,
      role: createdUser.role,
      email: createdUser.email,
      username: createdUser.username
    }
  };

  await sendMessages(TOPIC.USERS_STREAM, [event]);

  return createdUser;
};

module.exports = {
  deleteUser,
  updateUser,
  createUser
};