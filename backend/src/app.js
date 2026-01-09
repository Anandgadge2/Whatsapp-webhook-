/**
 * app.js
 * Main Express App Configuration
 */

require("dns").setDefaultResultOrder("ipv4first"); // 🔴 CRITICAL for MongoDB Atlas on Windows
require("dotenv").config({ path: __dirname + "/../.env" });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");

// --------------------------------------------------
// Initialize App
// --------------------------------------------------
const app = express();

// --------------------------------------------------
// Connect MongoDB (do NOT block app startup)
// --------------------------------------------------
connectDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
});

// --------------------------------------------------
// CORS CONFIG (STABLE + SAFE)
// --------------------------------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "https://zpdashboard.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, server-to-server, cron)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("🚫 Blocked by CORS:", origin);
      return callback(null, false); // ⬅️ never throw error
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight handling
app.options("*", cors());

// --------------------------------------------------
// Body Parsers
// --------------------------------------------------
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// --------------------------------------------------
// Routes
// --------------------------------------------------
app.use("/webhook", require("./routes/webhookRoutes"));
app.use("/api/grievances", require("./routes/grievanceRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// --------------------------------------------------
// Health Check
// --------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "G2C WhatsApp Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------
// Global Error Guard (prevents crash)
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

module.exports = app;
