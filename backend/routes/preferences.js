const express = require('express');
const router = express.Router();

// In-memory preferences store (replace with DB in production)
const userPreferences = {};

// Save user preferences
router.post('/', (req, res) => {
  const preferences = req.body;
  const { userId } = preferences;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Save or update preferences
  userPreferences[userId] = preferences;
  console.log(`Saved preferences for user ${userId}:`, preferences);

  res.status(200).json({ message: 'Preferences saved successfully' });
});

// Get preferences for a specific user (optional endpoint)
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const prefs = userPreferences[userId];

  if (!prefs) {
    return res.status(404).json({ error: 'Preferences not found' });
  }

  res.json(prefs);
});

module.exports = router;
