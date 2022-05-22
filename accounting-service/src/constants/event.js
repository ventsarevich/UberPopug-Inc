const CONSUMING_EVENT = {
  USER_ROLE_CHANGED: 'UserRoleChanged',
  USER_DELETED: 'UserDeleted',
  USER_CREATED: 'UserCreated',
  TASK_ADDED: 'TaskAdded',
  TASK_COMPLETED: 'TaskCompleted',
  TASK_UPDATED: 'TaskUpdated'
};

const CUD_EVENT = {
  PRICE_CREATED: 'PriceCreated',
  BALANCE_UPDATED: 'BalanceUpdated'
};

module.exports = { CONSUMING_EVENT, CUD_EVENT };
