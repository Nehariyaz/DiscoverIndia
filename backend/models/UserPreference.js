// backend/models/UserPreference.js
const mongoose = require('mongoose');

const UserPreferenceSchema = new mongoose.Schema({
  userId: { type: String },
  travelType: { type: String },
  budget: { type: Number },
  duration: { type: Number },
  climate: { type: String },
  accommodation: { type: String },
  preferredSeason: { type: String },
  travelFrequency: { type: String },
  notes: { type: String },
  interestedActivities: [String],
  transportModes: [String]
});

module.exports = mongoose.model('UserPreference', UserPreferenceSchema);
