const config = {
  PORT: process.env.PORT || 8030,
  CLIENT_ID: process.env.CLIENT_ID || '628a1fec48385b2847e1b071',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'analytics-secret',
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'mongodb://admin:admin@localhost:27021/analytics-service?authSource=admin',
  SESSION_SECRET: process.env.SESSION_SECRET || 'accounting-session-secret',
  SSO_SERVER_URL: process.env.SSO_SERVER_URL || 'http://localhost:8000/sso/login',
  SSO_SERVER_AUTHENTICATION_URL: process.env.SSO_SERVER_URL || 'http://localhost:8000/sso/verify',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'analytics-service',
  KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL || 'localhost:9092',
  KAFKA_USERS_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID || 'analytics-service-users-consumer-13',
  KAFKA_TASKS_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID || 'analytics-service-tasks-consumer-13',
  KAFKA_ACCOUNTING_CONSUMER_GROUP_ID: process.env.KAFKA_CONSUMER_GROUP_ID || 'analytics-service-accounting-consumer-13'
};

module.exports = config;
