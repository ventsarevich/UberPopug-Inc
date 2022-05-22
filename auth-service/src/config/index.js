const config = {
  PORT: process.env.PORT || 8000,
  CLIENT_ID: process.env.CLIENT_ID || '628a0cd1c3c2bf27f34f1f8f',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'auth-secret',
  DB_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'mongodb://admin:admin@localhost:27018/auth-service?authSource=admin',
  REDIS_CONNECTION_URL: process.env.DB_CONNECTION_URL || 'redis://localhost:6380',
  SESSION_SECRET: process.env.SESSION_SECRET || 'auth-session-secret',
  SSO_SERVER_URL: process.env.SSO_SERVER_URL || 'http://localhost:8000/sso/login',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'auth-service',
  KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL || 'localhost:9092'
};

module.exports = config;
