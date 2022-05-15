const EVENT = {
  USER_DELETED: 'UserDeleted',
  USER_CREATED: 'UserCreated',
  USER_ROLE_CHANGED: 'UserRoleChanged',
  TASK_UPDATED: 'TaskUpdated',
  TASK_ADDED: 'TaskAdded',
  TASK_COMPLETED: 'TaskCompleted',
  TASK_SHUFFLING_STARTED: 'TaskShufflingStarted'
};

const PATH = {
  [EVENT.USER_DELETED]: 'users/deleted',
  [EVENT.USER_CREATED]: 'users/created',
  [EVENT.USER_ROLE_CHANGED]: 'users/role-changed',
  [EVENT.TASK_UPDATED]: 'tasks/updated',
  [EVENT.TASK_ADDED]: 'tasks/added',
  [EVENT.TASK_COMPLETED]: 'tasks/completed',
  [EVENT.TASK_SHUFFLING_STARTED]: 'tasks/shuffling-started'
};

module.exports = { PATH };
