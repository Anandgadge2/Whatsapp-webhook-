require("dotenv").config({ path: __dirname + "/../.env" });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");

// ✅ Connect MongoDB
connectDB();

// Routes
const webhookRoutes = require("./routes/webhookRoutes");
const grievanceRoutes = require("./routes/grievanceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* --------------------------------------------------
   ✅ CORS CONFIG (CRITICAL FIX)
-------------------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:3001", // Frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

/* --------------------------------------------------
   Body Parsers
-------------------------------------------------- */
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

/* --------------------------------------------------
   Routes
-------------------------------------------------- */
app.use("/webhook", webhookRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

/* --------------------------------------------------
   Health Check
-------------------------------------------------- */
app.get("/", (req, res) => {
  res.json({
    status: "Bot Running",
    service: "G2C WhatsApp Backend",
    time: new Date().toISOString(),
  });
});

module.exports = app;
