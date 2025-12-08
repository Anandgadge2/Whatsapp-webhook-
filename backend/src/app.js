require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Correct paths – because app.js is inside src/
const incidentRoutes = require("./routes/incidentRoutes");
const officerRoutes = require("./routes/officerRoutes");
const statusRoutes = require("./routes/statusRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Error", err));

// Routes
app.use("/api/incidents", incidentRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/incidents", statusRoutes);
app.use("/webhook", webhookRoutes);

// Test
app.get("/", (req, res) => res.json({ status: "Bot Running" }));

module.exports = app;
