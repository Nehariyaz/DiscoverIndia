const express = require('express');
const router = express.Router();
const axios = require('axios');
const destinations = require('../data/destination'); // your local dataset

router.post('/chatbot-recommend', async (req, res) => {
  try {
    const requestBody = {
      userInput: req.body,
      dataset: destinations
    };

    const response = await axios.post('http://localhost:5001/recommend', requestBody);
    res.json(response.data);
  } catch (err) {
    console.error('ML error:', err.message);
    res.status(500).json({ error: 'Recommendation failed' });
  }
});

module.exports = router;
