const express = require("express");
const db = require("../models");
const router = express.Router();

// Route to log a page view
router.post("/log-page-view", async (req, res) => {
  const { route, timestamp } = req.body;

  // Validate the request body
  if (!route || !timestamp) {
    return res.status(400).json({ error: "Route and timestamp are required." });
  }

  try {
    // Log the page view into the database
    const pageView = await db.PageView.create({
      route,
      timestamp,
    });

    // Send a success response
    res
      .status(200)
      .json({ message: "Page view logged successfully.", pageView });
  } catch (error) {
    console.error("Error logging page view:", error);
    res.status(500).json({ error: "Failed to log page view." });
  }
});

module.exports = router;
