const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

router.get('/api/destinations/search', async (req, res) => {
  try {
    const { q = '', state, type } = req.query;

    let filter = {
      name: { $regex: q, $options: 'i' }
    };

    if (state) filter.state = state;
    if (type) filter.type = type;

    const results = await Destination.find(filter);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
});

router.get('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get destination' });
  }
});


module.exports = router;
