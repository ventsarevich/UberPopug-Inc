const { ROLE } = require('../constants/role');
const taskService = require('../services/task');
const userService = require('../services/user');
const { TOPIC } = require('../constants/topic');
const { STATUS } = require('../constants/status');
const { sendMessages } = require('../queue/producer');
const { CUD_EVENT, BUSINESS_EVENT, CONSUMING_EVENT } = require('../constants/event');
const { USER_STATUS } = require('../constants/userStatus');

const reassignTasks = async (tasksQuery) => {
  const tasksForReassign = await taskService.find(tasksQuery);
  if (!tasksForReassign.length) return null;
  console.log(tasksForReassign);

  const availableUsers = await userService.distinct(
    'publicId',
    { role: ROLE.USER, status: USER_STATUS.ACTIVE }
  );
  console.log(availableUsers);
  if (!availableUsers.length) return null;

  const events = await Promise.all(tasksForReassign.map(async (task) => {
    const assignee = availableUsers[Math.floor(Math.random() * availableUsers.length)];

    await taskService.update({ _id: task._id, assignee });

    return {
      type: CUD_EVENT.TASK_UPDATED,
      data: { publicId: task.publicId, assignee: task.assignee }
    };
  }));

  return sendMessages(TOPIC.TASKS_STREAM, events);
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
      description: task.description,
      creator: { publicId: creator.publicId, username: creator.username },
      assignee: { publicId: assignee.publicId, username: assignee.username }
    };
  });
};

const createTask = async ({ description, assignee, creator }) => {
  const createdTask = await taskService.create({ description, assignee, creator });

  const event = {
    type: BUSINESS_EVENT.TASK_ADDED,
    data: {
      publicId: createdTask.publicId,
      description: createdTask.description,
      assignee: createdTask.assignee,
      creator: createdTask.creator
    }
  };

  return sendMessages(TOPIC.TASKS, [event]);
};

const updateTask = async (payload) => {
  const task = await taskService.findById(payload._id);
  if (!task) return null;

  await taskService.update(payload);

  const event = {
    type: CUD_EVENT.TASK_UPDATED,
    data: {
      publicId: task.publicId,
      description: payload.description
    }
  };

  return sendMessages(TOPIC.TASKS_STREAM, [event]);
};

const shuffleTask = (emitter) => {
  const event = {
    type: BUSINESS_EVENT.TASK_SHUFFLING_STARTED,
    data: { emitter }
  };

  return sendMessages(TOPIC.TASKS, [event]);
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
    type: BUSINESS_EVENT.TASK_COMPLETED,
    data: { publicId }
  };

  return sendMessages(TOPIC.TASKS, [event]);
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