const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Verification endpoint
router.get('/', webhookController.verifyWebhook);

// Message handling endpoint
router.post('/', webhookController.handleIncomingMessage);

module.exports = router;
