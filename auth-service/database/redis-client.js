const RedisClient = require('redis');

const config = require('../config');

const client = RedisClient.createClient({ url: config.REDIS_CONNECTION_URL });
client.connect();

client.on('connect', function () {
  console.log(`Redis default connection open to ${config.REDIS_CONNECTION_URL}`);
});

client.on('error', (err) => {
  console.log(`Redis default connection error: ${err}`);
});

client.on('disconnected', () => {
  console.log('Redis default connection disconnected');
});

const setValue = async (key, value, ttl) => {
  const result = client.set(key, JSON.stringify(value));

  if (ttl) await client.expire(key, ttl);

  return result;
};

const getValue = async (key) => {
  const result = await client.get(key);

  return result ? JSON.parse(result) : null;
};

module.exports = {
  setValue,
  getValue
};