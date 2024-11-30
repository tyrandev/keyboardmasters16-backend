const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === "production";

// Load SSL certificates
let sslOptions = {};
if (isProduction) {
  // Production environment - use certificates from Let's Encrypt
  sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/keyboardmasters.org/privkey.pem"
    ), // Private key from Certbot
    cert: fs.readFileSync("/etc/letsencrypt/live/keyboardmasters.org/cert.pem"), // SSL certificate from Certbot
    ca: fs.readFileSync("/etc/letsencrypt/live/keyboardmasters.org/chain.pem"), // Certificate chain from Certbot
  };
} else {
  // Development environment - use local self-signed certificates
  sslOptions = {
    key: fs.readFileSync("./certificates/server.key"), // Local private key for development
    cert: fs.readFileSync("./certificates/server.crt"), // Local certificate for development
  };
}

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

// Start the HTTPS server with the correct SSL options based on environment
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  if (isProduction) {
    console.log("Server is running in production mode.");
  } else {
    console.log("Server is running in development mode.");
  }
  console.log(`Server running securely on port ${PORT}`);
});
