// server.js

const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = require("./models");
db.sequelize
  .sync()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// Routes
const authRoutes = require("./routes/auth"); // Import auth routes
const statsRoutes = require("./routes/stats");
const leaderboardRoute = require("./routes/leaderboard");

app.use("/api/auth", authRoutes); // Auth routes mapped to /api/auth
app.use("/api/stats", statsRoutes);
app.use("/api/leaderboard", leaderboardRoute);

// Start the server
const PORT = process.env.PORT || 5000;

if (isProduction) {
  // Load SSL certificates for production
  const sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/keyboardmasters.org/privkey.pem"
    ),
    cert: fs.readFileSync("/etc/letsencrypt/live/keyboardmasters.org/cert.pem"),
    ca: fs.readFileSync("/etc/letsencrypt/live/keyboardmasters.org/chain.pem"),
  };

  // Create an HTTPS server
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log("Server is running in production mode with HTTPS.");
    console.log(`Server running securely on port ${PORT}`);
  });
} else {
  // Create an HTTP server for development
  http.createServer(app).listen(PORT, () => {
    console.log("Server is running in development mode with HTTP.");
    console.log(`Server running on port ${PORT}`);
  });
}
