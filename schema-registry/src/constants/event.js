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

const PRICE_EVENT = {
  PRICE_CREATED: 'PriceCreated'
};

const BALANCE_EVENT = {
  BALANCE_UPDATED: 'BalanceUpdated'
};

module.exports = { USER_EVENT, TASK_EVENT, PRICE_EVENT, BALANCE_EVENT };
