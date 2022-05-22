const { Kafka } = require('kafkajs');

const config = require('../config');
const { TOPIC } = require('../constants/topic');
const userOperations = require('../operations/user');
const taskOperations = require('../operations/task');

const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers: [config.KAFKA_BROKER_URL],
  connectionTimeout: 3000
});

const initUsersConsumer = async () => {
  const usersConsumer = kafka.consumer({ groupId: config.KAFKA_USERS_CONSUMER_GROUP_ID });

  await usersConsumer.connect();
  await usersConsumer.subscribe({
    topics: [TOPIC.USERS_STREAM, TOPIC.USERS_ROLE_CHANGED, TOPIC.BALANCES_STREAM],
    fromBeginning: true
  });

  return usersConsumer.run({
    eachMessage: async ({ message }) => userOperations.processQueueMessage(message)
  });
};

const initTasksConsumer = async () => {
  const tasksConsumer = kafka.consumer({ groupId: config.KAFKA_TASKS_CONSUMER_GROUP_ID });

  await tasksConsumer.connect();
  await tasksConsumer.subscribe({
    topics: [TOPIC.TASKS_COMPLETED, TOPIC.TASKS_ADDED, TOPIC.TASKS_STREAM, TOPIC.PRICES_STREAM],
    fromBeginning: true
  });

  return tasksConsumer.run({
    eachMessage: async ({ message }) => taskOperations.processQueueMessage(message)
  });
};

const init = async () => Promise.all([
  initUsersConsumer(),
  initTasksConsumer()
]);

module.exports = {
  init
};
