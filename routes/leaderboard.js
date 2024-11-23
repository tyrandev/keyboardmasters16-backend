const express = require("express");
const db = require("../models");
const { Sequelize } = require("sequelize");

const router = express.Router();

// Route to get leaderboard
router.get("/", async (req, res) => {
  try {
    const accuracyThreshold = 95;

    // Get top 10 typists with accuracy above the threshold, sorted by best cleanSpeed (descending)
    const leaderboard = await db.Stats.findAll({
      where: { accuracy: { [Sequelize.Op.gte]: accuracyThreshold } }, // Accuracy >= threshold
      attributes: [
        "userId",
        [Sequelize.fn("MAX", Sequelize.col("cleanSpeed")), "cleanSpeed"], // Get the highest cleanSpeed for each user
        [Sequelize.fn("MAX", Sequelize.col("rawSpeed")), "rawSpeed"],
        [Sequelize.fn("MAX", Sequelize.col("accuracy")), "accuracy"],
        [Sequelize.fn("SUM", Sequelize.col("allWords")), "allWords"], // Aggregate stats
        [
          Sequelize.fn("SUM", Sequelize.col("incorrectWords")),
          "incorrectWords",
        ],
        [Sequelize.fn("SUM", Sequelize.col("allLetters")), "allLetters"],
        [
          Sequelize.fn("SUM", Sequelize.col("incorrectLetters")),
          "incorrectLetters",
        ],
      ],
      include: [
        {
          model: db.User,
          as: "user", // Use the alias here
          attributes: ["username"], // Include username from User table
        },
      ],
      group: ["userId"], // Group by userId to ensure unique users
      order: [[Sequelize.fn("MAX", Sequelize.col("cleanSpeed")), "DESC"]], // Sort by the highest cleanSpeed
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
      cleanSpeed: entry.dataValues.cleanSpeed,
      rawSpeed: entry.dataValues.rawSpeed,
      accuracy: entry.dataValues.accuracy,
      allWords: entry.dataValues.allWords,
      incorrectWords: entry.dataValues.incorrectWords,
      allLetters: entry.dataValues.allLetters,
      incorrectLetters: entry.dataValues.incorrectLetters,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
