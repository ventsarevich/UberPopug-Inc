const { v4: uuidv4 } = require('uuid');
const { validateEvent } = require('@ventsarevich/shema-registry');

const { ROLE } = require('../constants/role');
const taskService = require('../services/task');
const userService = require('../services/user');
const { TOPIC } = require('../constants/topic');
const { STATUS } = require('../constants/status');
const { sendMessages } = require('../queue/producer');
const { USER_STATUS } = require('../constants/user-status');
const { CUD_EVENT, BUSINESS_EVENT, CONSUMING_EVENT } = require('../constants/event');

const reassignTasks = async (tasksQuery) => {
  const tasksForReassign = await taskService.find(tasksQuery);
  if (!tasksForReassign.length) return null;

  const availableUsers = await userService.distinct(
    'publicId',
    { role: ROLE.USER, status: USER_STATUS.ACTIVE }
  );
  if (!availableUsers.length) return null;

  const events = await Promise.all(tasksForReassign.map(async (task) => {
    const assignee = availableUsers[Math.floor(Math.random() * availableUsers.length)];

    await taskService.update({ _id: task._id, assignee });

    const event = {
      id: uuidv4(),
      version: 2,
      time: new Date(),
      producer: 'task-service-producer',
      type: CUD_EVENT.TASK_UPDATED,
      data: {
        publicId: task.publicId,
        jiraId: task.jiraId,
        assignee_public_id: task.assignee
      }
    };

    const { isValid, error } = validateEvent(event);
    if (isValid) {
      return event;
    } else {
      console.log(`${CUD_EVENT.TASK_UPDATED} send is rejected`, error);
      return null;
    }
  }));

  return sendMessages(TOPIC.TASKS_STREAM, events.filter((e) => !!e));
};

const reassignTaskForUser = async (user) => {
  if (user.role && user.role === ROLE.USER) return null;

  return reassignTasks({ assignee: user.publicId, status: STATUS.CREATED });
};

const getTasks = async (currentUser) => {
  const isUser = currentUser.role === ROLE.USER;
  const query = isUser
    ? { $or: [{ creator: currentUser.publicId }, { assignee: currentUser.publicId }] }
    : {};
  const tasks = await taskService.find(query);

  const creators = tasks.map((task) => task.creator);
  const assignees = tasks.map((task) => task.assignee);
  const taskUserPublicIds = [...new Set([...creators, ...assignees])];
  const taskUsers = await userService.find({ publicId: { $in: taskUserPublicIds } });

  return tasks.map((task) => {
    const creator = taskUsers.find((user) => user.publicId === task.creator);
    const assignee = taskUsers.find((user) => user.publicId === task.assignee);

    return {
      _id: task._id,
      status: task.status,
      jiraId: task.jiraId,
      description: task.description,
      creator: { publicId: creator.publicId, username: creator.username },
      assignee: { publicId: assignee.publicId, username: assignee.username }
    };
  });
};

const createTask = async ({ description, assignee, creator }) => {
  const createdTask = await taskService.create({ description, assignee, creator });

  const event = {
    id: uuidv4(),
    version: 2,
    time: new Date(),
    producer: 'task-service-producer',
    type: BUSINESS_EVENT.TASK_ADDED,
    data: {
      publicId: createdTask.publicId,
      description: createdTask.description,
      assignee_public_id: createdTask.assignee,
      creator_public_id: createdTask.creator,
      jiraId: createdTask.jiraId
    }
  };

  const { isValid, error } = validateEvent(event);
  if (isValid) {
    await sendMessages(TOPIC.TASKS_ADDED, [event]);
  } else {
    console.log(`${BUSINESS_EVENT.TASK_ADDED} send is rejected`, error);
  }
};

const updateTask = async (payload) => {
  const task = await taskService.findById(payload._id);
  if (!task) return null;

  await taskService.update(payload);

  const event = {
    id: uuidv4(),
    version: 2,
    time: new Date(),
    producer: 'task-service-producer',
    type: CUD_EVENT.TASK_UPDATED,
    data: {
      publicId: task.publicId,
      jiraId: task.jiraId,
      description: payload.description
    }
  };

  const { isValid, error } = validateEvent(event);
  if (isValid) {
    await sendMessages(TOPIC.TASKS_STREAM, [event]);
  } else {
    console.log(`${CUD_EVENT.TASK_UPDATED} send is rejected`, error);
  }
};

const shuffleTask = async (emitter) => {
  const event = {
    id: uuidv4(),
    version: 1,
    time: new Date(),
    producer: 'task-service-producer',
    type: BUSINESS_EVENT.TASK_SHUFFLING_STARTED,
    data: { emitter }
  };

  const { isValid, error } = validateEvent(event);
  if (isValid) {
    await sendMessages(TOPIC.TASK_SHUFFLING_STARTED, [event]);
  } else {
    console.log(`${BUSINESS_EVENT.TASK_SHUFFLING_STARTED} send is rejected`, error);
  }
};

const processQueueMessages = async (messages) => {
  try {
    const emitters = messages
      .map((message) => JSON.parse(message.value))
      .filter((value) => value.type === CONSUMING_EVENT.TASK_SHUFFLING_STARTED)
      .map((value) => value.data.emitter);

    if (!emitters.length) return;

    console.log('This users trigger shuffling:', emitters);

    return reassignTasks({ status: STATUS.CREATED });
  } catch (error) {
    console.log('error', error);
  }
};

const completeTask = async (taskId, publicId) => {
  await taskService.update({ _id: taskId, status: STATUS.COMPLETED });

  const event = {
    id: uuidv4(),
    version: 1,
    time: new Date(),
    producer: 'task-service-producer',
    type: BUSINESS_EVENT.TASK_COMPLETED,
    data: { publicId }
  };

  const { isValid, error } = validateEvent(event);
  if (isValid) {
    await sendMessages(TOPIC.TASKS_COMPLETED, [event]);
  } else {
    console.log(`${BUSINESS_EVENT.TASK_COMPLETED} send is rejected`, error);
  }
};

module.exports = {
  reassignTaskForUser,
  getTasks,
  createTask,
  updateTask,
  shuffleTask,
  processQueueMessages,
  completeTask
};
