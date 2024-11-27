const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
    req.userId = decoded.id; // Save userId in request for later use
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

// User Registration
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = await db.User.create({ username, password });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res
      .status(200)
      .json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get User Account Details
router.get("/account", authenticateToken, async (req, res) => {
  try {
    // Fetch the user information based on userId from the token
    const user = await db.User.findOne({
      where: { id: req.userId }, // Find user by the ID stored in the token
      attributes: ["username"], // Return only the username field
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user information
    res.status(200).json({ username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
