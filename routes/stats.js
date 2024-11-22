const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../models");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to authenticate the user using JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// Create stats for the authenticated user
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
    // Check if the stats already exist for the user (optional)
    const existingStats = await db.Stats.findOne({
      where: { userId: req.userId },
    });
    if (existingStats) {
      return res
        .status(400)
        .json({ message: "Stats already created for this user" });
    }

    // Create new stats for the authenticated user
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

    // Respond with the newly created stats
    res.status(201).json({
      message: "Stats created successfully",
      stats: newStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;