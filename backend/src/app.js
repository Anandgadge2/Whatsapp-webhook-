const express = require('express');
const bodyParser = require('body-parser');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/webhook', webhookRoutes);

app.get('/', (req, res) => {
  res.send('WhatsApp Webhook Server is running');
});

module.exports = app;
