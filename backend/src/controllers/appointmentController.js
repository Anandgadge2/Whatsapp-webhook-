const appointmentService = require("../services/appointmentService");

/**
 * Create a new appointment
 */
exports.createAppointment = async (req, res) => {
  try {
    const {
      userName,
      phone,
      department,
      purpose,
      preferredDate,
      preferredTime,
    } = req.body;

    const appointment = await appointmentService.createAppointment({
      userName,
      phone,
      department,
      purpose,
      preferredDate,
      preferredTime,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
    });
  }
};

/**
 * Get appointment status by ID
 */
exports.getAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await appointmentService.getAppointmentStatus(
      appointmentId
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
    });
  }
};

/**
 * Get all appointments by phone
 */
exports.getAppointmentsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const appointments = await appointmentService.getAppointmentsByPhone(phone);

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

/**
 * Confirm appointment (Admin)
 */
exports.confirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { confirmedDate, confirmedTime, officerName } = req.body;

    const appointment = await appointmentService.confirmAppointment(
      appointmentId,
      confirmedDate,
      confirmedTime,
      officerName
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      message: "Appointment confirmed successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm appointment",
    });
  }
};

/**
 * Cancel appointment (Admin)
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { remarks } = req.body;

    const appointment = await appointmentService.cancelAppointment(
      appointmentId,
      remarks
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};

/**
 * Get all appointments (Admin)
 */
exports.getAllAppointments = async (req, res) => {
  try {
    const Appointment = require("../models/Appointment");
    const appointments = await Appointment.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};
