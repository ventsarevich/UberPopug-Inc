const taskService = require('../services/task');
const { STATUS } = require('../constants/task-status');
const { CONSUMING_EVENT } = require('../constants/event');

const addTask = async (value) => {
  const task = await taskService.findOne({ publicId: value.data.publicId });
  const payload = {
    publicId: value.data.publicId,

    description: value.data.description,
    status: STATUS.CREATED,

    creator: value.data.creator_public_id,
    assignee: value.data.assignee_public_id
  };

  return task
    ? taskService.update({ ...payload, _id: task._id })
    : taskService.create(payload);
};

const setPrice = async (value) => {
  const task = await taskService.findOne({ publicId: value.data.taskPublicId });
  console.log('task', task);

  return task
    ? taskService.update({
      _id: task._id,
      publicId: value.data.taskPublicId,
      cost: value.data.cost,
      fee: value.data.fee
    })
    : taskService.create({
      publicId: value.data.taskPublicId,
      cost: value.data.cost,
      fee: value.data.fee
    });
};

const completeTask = async (value) => {
  const task = taskService.findOne({ publicId: value.data.publicId });
  return taskService.update({ _id: task._id, status: STATUS.COMPLETED });
};

const updateTask = async (value) => {
  const task = await taskService.findOne({ publicId: value.data.publicId });

  const payload = {
    publicId: value.data.publicId,
    description: value.data.description,
    assignee: value.data.assignee_public_id
  };

  return task ? taskService.update(payload) : taskService.create(payload);
};

const processQueueMessage = async (message) => {
  const value = JSON.parse(message.value);

  console.log('Task Message', value);

  try {
    switch ([value.type, value.version].join(' ')) {
      case `${CONSUMING_EVENT.TASK_UPDATED} 1`:
      case `${CONSUMING_EVENT.TASK_UPDATED} 2`:
        if (value.version === 2) {
          value.data.description = `[${value.data.jiraId}] - ${value.data.description}`;
        }
        return updateTask(value);
      case `${CONSUMING_EVENT.TASK_COMPLETED} 1`:
        return completeTask(value);
      case `${CONSUMING_EVENT.TASK_ADDED} 1`:
      case `${CONSUMING_EVENT.TASK_ADDED} 2`:
        if (value.version === 2) {
          value.data.description = `[${value.data.jiraId}] - ${value.data.description}`;
        }
        return addTask(value);
      case `${CONSUMING_EVENT.PRICE_CREATED} 1`:
        return setPrice(value);
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
