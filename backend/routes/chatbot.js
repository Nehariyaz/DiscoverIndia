const express = require('express');
const router = express.Router();
const axios = require('axios');
const destinations = require('../data/destination'); // your local dataset

function sanitizeNaN(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeNaN);
  } else if (obj !== null && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'number' && Number.isNaN(value)) {
        sanitized[key] = null;
      } else if (typeof value === 'string' && value.toLowerCase() === 'nan') {
        sanitized[key] = null;
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeNaN(value); // recurse
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  } else {
    return obj;
  }
}

router.post('/chatbot-recommend', async (req, res) => {
  try {
    const requestBody = {
      userInput: req.body,
      dataset: destinations
    };

    const response = await axios.post('http://localhost:5001/recommend', requestBody);

    // Sanitize NaNs in response.data before sending to frontend
    const cleanedData = sanitizeNaN(response.data);

    res.json(cleanedData);
  } catch (err) {
    console.error('ML error:', err.message);
    res.status(500).json({ error: 'Recommendation failed' });
  }
});

module.exports = router;
