const express = require("express");
const db = require("../models");
const geoip = require("geoip-lite");
const router = express.Router();

// Route to log a page view
router.post("/log-page-view", async (req, res) => {
  const { route } = req.body; // No need to get timestamp from frontend anymore

  // Validate input
  if (!route) {
    return res.status(400).json({ error: "Route is required." });
  }

  // Get the user's IP address
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Use geoip-lite to get location data based on the IP address
  const geo = geoip.lookup(ipAddress);

  // Get the location (country or city) from the geolocation data
  const location = geo ? geo.country : "Unknown"; // Default to 'Unknown' if geo data is unavailable

  try {
    // Create a new page view entry in the database (Sequelize will handle the timestamp)
    const pageView = await db.PageView.create({
      route,
      ipAddress,
      location,
      // Don't include timestamp here, Sequelize will automatically set the createdAt field
    });

    // Respond with success
    res
      .status(200)
      .json({ message: "Page view logged successfully.", pageView });
  } catch (error) {
    console.error("Error logging page view:", error);
    res.status(500).json({ error: "Failed to log page view." });
  }
});

module.exports = router;
