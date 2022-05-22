const config = {
  PORT: process.env.PORT || 8010,
  CLIENT_ID: process.env.CLIENT_ID || '628a0d9f84f043280d8e797c',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'task-secret',
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'mongodb://admin:admin@localhost:27019/task-service?authSource=admin',
  SESSION_SECRET: process.env.SESSION_SECRET || 'task-session-secret',
  SSO_SERVER_URL: process.env.SSO_SERVER_URL || 'http://localhost:8000/sso/login',
  SSO_SERVER_AUTHENTICATION_URL: process.env.SSO_SERVER_URL || 'http://localhost:8000/sso/verify',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'task-service',
  KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL || 'localhost:9092',
  KAFKA_USERS_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID || 'task-service-users-consumer',
  KAFKA_TASKS_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID || 'task-service-tasks-consumer'
};

module.exports = config;
