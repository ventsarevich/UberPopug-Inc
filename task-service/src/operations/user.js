const { ROLE } = require('../constants/role');
const userService = require('../services/user');
const taskOperations = require('../operations/task');
const { CONSUMING_EVENT } = require('../constants/event');
const { USER_STATUS } = require('../constants/user-status');

const processQueueMessage = async (message) => {
  const value = JSON.parse(message.value);

  console.log('value', value);

  try {
    switch ([value.type, value.version].join(' ')) {
      case `${CONSUMING_EVENT.USER_DELETED} 1`:
        await userService.update({ publicId: value.data.publicId, status: USER_STATUS.DELETED });
        return taskOperations.reassignTaskForUser(value.data);
      case `${CONSUMING_EVENT.USER_CREATED} 1`:
        return userService.create(value.data);
      case `${CONSUMING_EVENT.USER_ROLE_CHANGED} 1`:
        await userService.update(value.data);
        return taskOperations.reassignTaskForUser(value.data);
      default:
        return null;
    }
  } catch (error) {
    console.log('error', error);
  }
};

const usersForAssign = async (currentUser) => {
  const users = await userService.find({ role: ROLE.USER, status: USER_STATUS.ACTIVE });
  console.log(users);

  return users.filter((user) => user.publicId !== currentUser.publicId);
};

module.exports = {
  processQueueMessage,
  usersForAssign
};
