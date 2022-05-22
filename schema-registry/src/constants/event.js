const USER_EVENT = {
  USER_DELETED: 'UserDeleted',
  USER_CREATED: 'UserCreated',
  USER_ROLE_CHANGED: 'UserRoleChanged'
};

const TASK_EVENT = {
  TASK_UPDATED: 'TaskUpdated',
  TASK_ADDED: 'TaskAdded',
  TASK_COMPLETED: 'TaskCompleted',
  TASK_SHUFFLING_STARTED: 'TaskShufflingStarted'
};

module.exports = { USER_EVENT, TASK_EVENT };
