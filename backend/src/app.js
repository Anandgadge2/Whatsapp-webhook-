const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const webhookRoutes = require("./routes/webhookRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// WHATSAPP WEBHOOK
app.use("/webhook", webhookRoutes);
const adminRoutes = require("./routes/adminRoutes");

app.use("/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("✅ Forest Department WhatsApp System is Running");
});

module.exports = app;
