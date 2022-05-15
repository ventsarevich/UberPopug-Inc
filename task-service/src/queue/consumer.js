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
  await usersConsumer.subscribe({ topics: [TOPIC.USERS_STREAM, TOPIC.USERS_ROLE_CHANGED], fromBeginning: true });

  return usersConsumer.run({
    eachMessage: async ({ message }) => userOperations.processQueueMessage(message)
  });
};

const initTasksConsumer = async () => {
  const tasksConsumer = kafka.consumer({ groupId: config.KAFKA_TASKS_CONSUMER_GROUP_ID });

  await tasksConsumer.connect();
  await tasksConsumer.subscribe({ topics: [TOPIC.TASK_SHUFFLING_STARTED], fromBeginning: true });

  await tasksConsumer.run({
    eachBatchAutoResolve: false,
    eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
      await taskOperations.processQueueMessages(batch.messages);

      if (!isRunning() || isStale()) return;

      resolveOffset(batch.messages[batch.messages.length - 1].offset);

      await heartbeat();

      tasksConsumer.pause([{ topic: TOPIC.TASK_SHUFFLING_STARTED }]);
      setTimeout(() => tasksConsumer.resume([{ topic: TOPIC.TASK_SHUFFLING_STARTED }]), 10000);
    }
  });
};

const init = async () => Promise.all([
  initUsersConsumer(),
  initTasksConsumer()
]);

module.exports = {
  init
};