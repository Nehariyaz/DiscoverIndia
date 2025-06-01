const Destination = require('../models/Destination');

// GET /api/destinations
exports.getAllDestinations = async (req, res) => {
  const data = await Destination.find();
  res.json(data);
};

// POST /api/destinations
exports.createDestination = async (req, res) => {
  const newDestination = new Destination(req.body);
  const saved = await newDestination.save();
  res.status(201).json(saved);
};
