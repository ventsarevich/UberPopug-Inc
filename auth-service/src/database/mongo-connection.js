const mongoose = require('mongoose');

const config = require('../config');

const init = () => {
  mongoose.connect(config.DB_CONNECTION_URL);

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose default connection open to ${config.DB_CONNECTION_URL}`);
  });

  mongoose.connection.on('error', (err) => {
    console.log(`Mongoose default connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });
};

module.exports = init;