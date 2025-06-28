
const express = require("express");
const router = express.Router();
const destinations = require("../data/destination"); // path to your module.exports

router.get("/", (req, res) => {
  res.json(destinations);
});

module.exports = router;
