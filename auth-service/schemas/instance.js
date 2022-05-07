const mongoose = require('mongoose');

const Instance = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, require: true },
  url: { type: String, require: true },
  secret: { type: String, require: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const model = mongoose.model('instance', Instance);

module.exports = model;
