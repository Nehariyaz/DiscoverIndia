const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: String,
  state: String,
  description: String,
});

module.exports = mongoose.model('Destination', DestinationSchema);
