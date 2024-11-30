const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load SSL certificates
const sslOptions = {
  key: fs.readFileSync("./certificates/server.key"), // Path to your private key
  cert: fs.readFileSync("./certificates/server.crt"), // Path to your certificate
};

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
app.use("/api/leaderboard", leaderboardRoute);

// Start the HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});
