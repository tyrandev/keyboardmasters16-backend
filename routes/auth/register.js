const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../../models");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

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

module.exports = router;
