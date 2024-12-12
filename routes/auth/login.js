// routes/auth/login.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../../middleware/auth");
const db = require("../../models");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

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

module.exports = router;
