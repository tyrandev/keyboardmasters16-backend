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
    // Create new stats for the authenticated user
    const newStats = await db.Stats.create({
      cleanSpeed,
      rawSpeed,
      accuracy,
      allWords,
      incorrectWords,
      allLetters,
      incorrectLetters,
      userId: req.userId, // Use the authenticated user's ID
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

// Fetch all stats for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Find all stats for the authenticated user
    const userStats = await db.Stats.findAll({
      where: { userId: req.userId },
    });

    // Check if stats exist
    if (!userStats || userStats.length === 0) {
      return res.status(404).json({ message: "No stats found for this user" });
    }

    // Respond with the user's stats
    res.status(200).json(userStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
