const userService = require('../services/user');
const { CONSUMING_EVENT } = require('../constants/event');
const { USER_STATUS } = require('../constants/user-status');

const processQueueMessage = async (message) => {
  const value = JSON.parse(message.value);

  console.log('User Message', value);

  try {
    switch ([value.type, value.version].join(' ')) {
      case `${CONSUMING_EVENT.USER_DELETED} 1`:
        return userService.update({ publicId: value.data.publicId }, { status: USER_STATUS.DELETED });
      case `${CONSUMING_EVENT.USER_CREATED} 1`:
        return userService.create(value.data);
      case `${CONSUMING_EVENT.USER_ROLE_CHANGED} 1`:
        return userService.update({ publicId: value.data.publicId }, value.data);
      default:
        return null;
    }
  } catch (error) {
    console.log('error', error);
  }
};

module.exports = {
  processQueueMessage
};
