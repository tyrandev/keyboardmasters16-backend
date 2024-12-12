const express = require("express");
const db = require("../models");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const {
    cleanSpeed,
    rawSpeed,
    accuracy,
    allWords,
    incorrectWords,
    allLetters,
    incorrectLetters,
  } = req.body;

  try {
    const newStats = await db.Stats.create({
      cleanSpeed,
      rawSpeed,
      accuracy,
      allWords,
      incorrectWords,
      allLetters,
      incorrectLetters,
      userId: req.userId,
    });
    res.status(201).json({
      message: "Stats created successfully",
      stats: newStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const start = parseInt(req.query.start, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;

    const userStats = await db.Stats.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
      offset: start,
      limit,
    });

    if (!userStats || userStats.length === 0) {
      return res.status(404).json({
        message: "No stats found for this user in the specified range",
      });
    }

    res.status(200).json(userStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
