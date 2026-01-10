const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Create new appointment
router.post("/", appointmentController.createAppointment);

// Get appointment by ID
router.get("/:appointmentId", appointmentController.getAppointmentStatus);

// Get all appointments by phone
router.get("/phone/:phone", appointmentController.getAppointmentsByPhone);

// Confirm appointment (Admin)
router.put("/:appointmentId/confirm", appointmentController.confirmAppointment);

// Cancel appointment (Admin)
router.put("/:appointmentId/cancel", appointmentController.cancelAppointment);

// Get all appointments (Admin)
router.get("/", appointmentController.getAllAppointments);

module.exports = router;
