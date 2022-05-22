const { v4: uuidv4 } = require('uuid');
const { validateEvent } = require('@ventsarevich/shema-registry');

const producer = require('../queue/producer');
const userService = require('../services/user');
const taskService = require('../services/task');
const { TOPIC } = require('../constants/topic');
const { sendMessages } = require('../queue/producer');
const { STATUS } = require('../constants/task-status');
const { TYPE } = require('../constants/audit-log-type');
const auditLogService = require('../services/audit-log');
const { CONSUMING_EVENT, CUD_EVENT } = require('../constants/event');
const { changeBalance } = require('./user');

const createTask = async (payload) => {
  const task = await taskService.create(payload);

  const event = {
    id: uuidv4(),
    version: 1,
    time: new Date(),
    producer: 'accounting-service-producer',
    type: CUD_EVENT.PRICE_CREATED,
    data: {
      taskPublicId: task.publicId,
      cost: task.cost,
      fee: task.fee
    }
  };

  console.log(event);

  const { isValid, error } = validateEvent(event);
  if (isValid) {
    await sendMessages(TOPIC.PRICES_STREAM, [event]);
  } else {
    console.log(`${CUD_EVENT.PRICE_CREATED} send is rejected`, error);
  }

  return task;
};

const addTask = async (value) => {
  const assignee = await userService.findOne({ publicId: value.data.assignee_public_id });
  if (!assignee) {
    console.log('Assignee not found for event', value);
    return producer.sendMessages(TOPIC.ACCOUNTING_RETRY, [value]);
  }
  const creator = await userService.findOne({ publicId: value.data.creator_public_id });
  if (!creator) {
    console.log('Creator not found for event', value);
    return producer.sendMessages(TOPIC.ACCOUNTING_RETRY, [value]);
  }

  const exists = await taskService.exists({ publicId: value.data.publicId });
  if (exists) return null;

  const task = await createTask({
    publicId: value.data.publicId,

    description: value.data.description,
    status: STATUS.CREATED,

    creator: creator._id,
    assignee: assignee._id
  });

  return Promise.all([
    changeBalance(creator._id, -task.fee),
    auditLogService.create({
      userId: creator._id,
      taskId: task._id,
      type: TYPE.SPENDING
    })
  ]);
};

const completeTask = async (value) => {
  const task = await taskService.findOne({ publicId: value.data.publicId });
  if (!task) {
    return producer.sendMessages(TOPIC.ACCOUNTING_RETRY, [value]);
  }
  if (task.status === STATUS.COMPLETED) return null;

  return Promise.all([
    changeBalance(task.assignee, task.cost),
    taskService.update({ _id: task._id, status: STATUS.COMPLETED }),
    auditLogService.create({
      userId: task.assignee,
      taskId: task._id,
      type: TYPE.RECEIPT
    })
  ]);
};

const updateTask = async (value) => {
  const task = await taskService.findOne({ publicId: value.data.publicId });

  if (!task) {
    console.log('Task not found for event', value);
    return producer.sendMessages(TOPIC.ACCOUNTING_RETRY, [value]);
  }

  const payload = {
    publicId: task.publicId,
    description: value.data.description,
    assignee: value.data.assignee_public_id
  };

  return taskService.update(payload);
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
