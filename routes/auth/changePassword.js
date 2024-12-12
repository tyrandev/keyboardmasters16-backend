// routes/auth/changePassword.js
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../../models");
const { authenticateToken } = require("./authMiddleware");

const router = express.Router();

const checkPassword = async (userId, currentPassword) => {
  const user = await db.User.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  return true;
};

router.post("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required" });
  }

  try {
    await checkPassword(req.userId, currentPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.User.update(
      { password: hashedPassword },
      { where: { id: req.userId } }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    if (err.message === "Current password is incorrect") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
