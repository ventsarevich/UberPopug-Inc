const CONSUMING_EVENT = {
  USER_ROLE_CHANGED: 'UserRoleChanged',
  USER_DELETED: 'UserDeleted',
  USER_CREATED: 'UserCreated',
  TASK_SHUFFLING_STARTED: 'TaskShufflingStarted'
};

const CUD_EVENT = {
  TASK_UPDATED: 'TaskUpdated'
};

const BUSINESS_EVENT = {
  TASK_ADDED: 'TaskAdded',
  TASK_COMPLETED: 'TaskCompleted',
  TASK_SHUFFLING_STARTED: 'TaskShufflingStarted'
};

module.exports = { CONSUMING_EVENT, CUD_EVENT, BUSINESS_EVENT };
