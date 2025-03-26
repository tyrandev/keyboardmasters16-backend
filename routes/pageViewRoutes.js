const express = require("express");
const db = require("../models");
const geoip = require("geoip-lite");
const router = express.Router();

// Route to log a page view
router.post("/log-page-view", async (req, res) => {
  // Simply return a success response without logging anything
  res.status(200).json({ message: "Page view logging is disabled." });
});

module.exports = router;
