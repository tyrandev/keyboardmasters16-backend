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
const authRoutes = require("./routes/auth");
const statsRoutes = require("./routes/stats");
const leaderboardRoute = require("./routes/leaderboard");

app.use("/api/auth", authRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/leaderboard", leaderboardRoute);

// Start the server
const PORT = process.env.PORT || 5000;

if (isProduction) {
  // Load SSL certificates for production
  const sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/keyboardmasters.org/privkey.pem"
    ), // Private key from Certbot
    cert: fs.readFileSync("/etc/letsencrypt/live/keyboardmasters.org/cert.pem"), // SSL certificate from Certbot
    ca: fs.readFileSync("/etc/letsencrypt/live/keyboardmasters.org/chain.pem"), // Certificate chain from Certbot
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
