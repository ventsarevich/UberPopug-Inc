const config = {
  PORT: process.env.PORT || 8020,
  CLIENT_ID: process.env.CLIENT_ID || '6280e1b711012edacd5f587c',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'accounting-secret',
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'mongodb://admin:admin@localhost:27020/accounting-service?authSource=admin',
  SESSION_SECRET: process.env.SESSION_SECRET || 'accounting-session-secret',
  SSO_SERVER_URL: process.env.SSO_SERVER_URL || 'http://localhost:8000/sso/login',
  SSO_SERVER_AUTHENTICATION_URL: process.env.SSO_SERVER_URL || 'http://localhost:8000/sso/verify',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'auth-service',
  KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL || 'localhost:9092',
  KAFKA_USERS_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID || 'accounting-service-users-consumer',
  KAFKA_TASKS_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID || 'accounting-service-tasks-consumer'
};

module.exports = config;
