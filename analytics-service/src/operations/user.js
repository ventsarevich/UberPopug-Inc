const userService = require('../services/user');
const { CONSUMING_EVENT } = require('../constants/event');
const { USER_STATUS } = require('../constants/user-status');

const setBalance = async (value) => {
  const user = await userService.findOne({ publicId: value.data.userPublicId });

  return user
    ? userService.update({ publicId: value.data.userPublicId }, { balance: value.data.balance })
    : userService.create({ publicId: value.data.userPublicId, balance: value.data.balance });
};

const processQueueMessage = async (message) => {
  const value = JSON.parse(message.value);

  console.log('User Message', value);

  try {
    switch ([value.type, value.version].join(' ')) {
      case `${CONSUMING_EVENT.USER_DELETED} 1`:
        return userService.update({ publicId: value.data.publicId }, { status: USER_STATUS.DELETED });
      case `${CONSUMING_EVENT.USER_CREATED} 1`:
        const user = await userService.findOne({ publicId: value.data.publicId });
        console.log('user', user);
        return user
          ? userService.update({ publicId: value.data.publicId }, value.data)
          : userService.create(value.data);
      case `${CONSUMING_EVENT.USER_ROLE_CHANGED} 1`:
        return userService.update({ publicId: value.data.publicId }, value.data);
      case `${CONSUMING_EVENT.BALANCE_UPDATED} 1`:
        return setBalance(value);
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
