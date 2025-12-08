const express = require("express");
const router = express.Router();
const { reportIncident } = require("../controllers/incidentController");

router.post("/report", reportIncident);

module.exports = router;
