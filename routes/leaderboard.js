const express = require("express");
const db = require("../models");

const router = express.Router();

// Route to get leaderboard
router.get("/", async (req, res) => {
  // Notice '/' here, not '/leaderboard'
  try {
    const accuracyThreshold = 95;

    // Get top 10 typists with accuracy above the threshold, sorted by cleanSpeed (descending)
    const leaderboard = await db.Stats.findAll({
      where: { accuracy: { [db.Sequelize.Op.gte]: accuracyThreshold } }, // Accuracy >= threshold
      include: [
        {
          model: db.User,
          as: "user", // Use the alias here
          attributes: ["username"], // Include username from User table
        },
      ],
      order: [["cleanSpeed", "DESC"]], // Sort by cleanSpeed in descending order
      limit: 10, // Limit to the top 10 results
    });

    // If no leaderboard data found
    if (leaderboard.length === 0) {
      return res
        .status(404)
        .json({ message: `No users with accuracy >= ${accuracyThreshold}%` });
    }

    // Format the response to include stats and username
    const result = leaderboard.map((entry) => ({
      username: entry.user.username, // Access the user via the alias
      cleanSpeed: entry.cleanSpeed,
      rawSpeed: entry.rawSpeed,
      accuracy: entry.accuracy,
      allWords: entry.allWords,
      incorrectWords: entry.incorrectWords,
      allLetters: entry.allLetters,
      incorrectLetters: entry.incorrectLetters,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
