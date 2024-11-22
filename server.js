const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = require("./models");
db.sequelize
  .sync()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// Routes
const authRoutes = require("./routes/auth");
const statsRoutes = require("./routes/stats");
const leaderboardRoute = require("./routes/leaderboard");

app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api", leaderboardRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
