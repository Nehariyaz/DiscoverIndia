const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  sentAt: { type: Date, default: Date.now },
  status: String,
  error: String,
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
