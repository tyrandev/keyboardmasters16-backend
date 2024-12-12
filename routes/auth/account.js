// routes/auth/account.js
const express = require("express");
const db = require("../../models");
const { authenticateToken } = require("./authMiddleware");

const router = express.Router();

router.get("/account", authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findOne({
      where: { id: req.userId },
      attributes: ["username"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
