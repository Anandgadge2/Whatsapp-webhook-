const express = require("express");
const router = express.Router();
const grievanceController = require("../controllers/grievanceController");

// Create new grievance
router.post("/", grievanceController.createGrievance);

// Get grievance by ID
router.get("/:grievanceId", grievanceController.getGrievanceStatus);

// Get all grievances by phone
router.get("/phone/:phone", grievanceController.getGrievancesByPhone);

// Update grievance status (Admin)
router.put("/:grievanceId", grievanceController.updateGrievanceStatus);

// Get all grievances (Admin)
router.get("/", grievanceController.getAllGrievances);

module.exports = router;
