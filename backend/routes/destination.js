const express = require('express');
const router = express.Router();
const destinations = require('../data/destination');

function sanitizeNaN(obj) {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'number' && Number.isNaN(value)) {
      sanitized[key] = null;
    } else if (typeof value === 'string' && value.toLowerCase() === 'nan') {
      sanitized[key] = null;
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// GET all destinations
router.get('/', (req, res) => {
  const sanitizedDestinations = destinations.map(dest => sanitizeNaN(dest));
  res.json(sanitizedDestinations);
});

// ✅ NEW: GET destinations that match a search query
router.get('/search', (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query) return res.json([]);

  const results = destinations.filter(dest =>
    dest.name.toLowerCase().includes(query) ||
    dest.state.toLowerCase().includes(query) ||
    (dest.description && dest.description.toLowerCase().includes(query)) ||
    (dest.activities && dest.activities.some(a => a.toLowerCase().includes(query)))
  ).map(dest => sanitizeNaN(dest));

  res.json(results);
});

// GET destination by name (slug-safe)
router.get('/:name', (req, res) => {
  const searchName = req.params.name.toLowerCase().replace(/-/g, ' ');

  const destination = destinations.find(d =>
    d.name.toLowerCase() === searchName
  );

  if (destination) {
    res.json(sanitizeNaN(destination));
  } else {
    res.status(404).json({ error: 'Destination not found' });
  }
});

module.exports = router;
