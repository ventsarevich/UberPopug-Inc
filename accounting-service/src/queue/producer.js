const { Kafka } = require('kafkajs');

const config = require('../config');

const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers: [config.KAFKA_BROKER_URL],
  connectionTimeout: 3000
});

const producer = kafka.producer();

const sendMessages = async (topic, events) => {
  const messages = events.map((event) => ({ value: JSON.stringify(event) }));

  return producer.send({ topic, messages });
};

const init = async () => producer.connect();

module.exports = {
  init,
  sendMessages
};