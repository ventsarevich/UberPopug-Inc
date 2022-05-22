const { v4: uuidv4 } = require('uuid');

const userService = require('../services/user');
const { CONSUMING_EVENT, CUD_EVENT } = require('../constants/event');
const { USER_STATUS } = require('../constants/user-status');
const { validateEvent } = require('@ventsarevich/shema-registry');
const { sendMessages } = require('../queue/producer');
const { TOPIC } = require('../constants/topic');

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

const changeBalance = async (creatorId, value) => {
  await userService.addBalance(creatorId, value);
  const updatedInfo = await userService.findOne({ _id: creatorId });
  console.log('updatedInfo', updatedInfo);

  const event = {
    id: uuidv4(),
    version: 1,
    time: new Date(),
    producer: 'accounting-service-producer',
    type: CUD_EVENT.BALANCE_UPDATED,
    data: {
      userPublicId: updatedInfo.publicId,
      balance: updatedInfo.balance
    }
  };

  console.log(event);

  const { isValid, error } = validateEvent(event);
  if (isValid) {
    await sendMessages(TOPIC.BALANCES_STREAM, [event]);
  } else {
    console.log(`${CUD_EVENT.BALANCE_UPDATED} send is rejected`, error);
  }
};

module.exports = {
  processQueueMessage,
  changeBalance
};
