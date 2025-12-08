const express = require("express");
const router = express.Router();
const { updateStatus } = require("../controllers/statusController");

router.patch("/:id/status", updateStatus);

module.exports = router;
