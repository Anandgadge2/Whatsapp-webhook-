const Appointment = require("../models/Appointment");
const whatsapp = require("./whatsappService");

/**
 * Create a new appointment and send acknowledgement
 */
async function createAppointment(data) {
  try {
    const appointment = await Appointment.create(data);

    // Send acknowledgement to citizen
    const ackMessage =
      `✅ *Appointment Booked Successfully*\n\n` +
      `🎫 *Appointment ID:* ${appointment.appointmentId}\n` +
      `🏛️ *Department:* ${appointment.department}\n` +
      `📅 *Preferred Date:* ${new Date(
        appointment.preferredDate
      ).toLocaleDateString()}\n` +
      `⏰ *Preferred Time:* ${appointment.preferredTime}\n` +
      `📊 *Status:* ${appointment.status}\n\n` +
      `You will receive a confirmation message once your appointment is confirmed.\n\n` +
      `Track your appointment by sending:\n` +
      `*APPOINTMENT ${appointment.appointmentId}*\n\n` +
      `Thank you! 🙏`;

    await whatsapp.sendText(data.phone, ackMessage);

    return appointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

/**
 * Get appointment status by ID
 */
async function getAppointmentStatus(appointmentId) {
  try {
    const appointment = await Appointment.findOne({ appointmentId });

    if (!appointment) {
      return null;
    }

    return appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
}

/**
 * Get all appointments by phone number
 */
async function getAppointmentsByPhone(phone) {
  try {
    const appointments = await Appointment.find({ phone }).sort({
      createdAt: -1,
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

/**
 * Confirm appointment and notify citizen
 */
async function confirmAppointment(
  appointmentId,
  confirmedDate,
  confirmedTime,
  officerName
) {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      {
        status: "CONFIRMED",
        confirmedDate,
        confirmedTime,
        officerName,
      },
      { new: true }
    );

    if (!appointment) {
      return null;
    }

    // Send confirmation to citizen
    const confirmMessage =
      `✅ *Appointment Confirmed*\n\n` +
      `🎫 *Appointment ID:* ${appointment.appointmentId}\n` +
      `🏛️ *Department:* ${appointment.department}\n` +
      `📅 *Confirmed Date:* ${new Date(confirmedDate).toLocaleDateString()}\n` +
      `⏰ *Confirmed Time:* ${confirmedTime}\n` +
      `👤 *Officer:* ${officerName}\n\n` +
      `Please arrive 10 minutes before your scheduled time.\n` +
      `Bring necessary documents.\n\n` +
      `Thank you! 🙏`;

    await whatsapp.sendText(appointment.phone, confirmMessage);

    return appointment;
  } catch (error) {
    console.error("Error confirming appointment:", error);
    throw error;
  }
}

/**
 * Cancel appointment and notify citizen
 */
async function cancelAppointment(appointmentId, remarks = "") {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      {
        status: "CANCELLED",
        remarks,
      },
      { new: true }
    );

    if (!appointment) {
      return null;
    }

    // Send cancellation notification
    const cancelMessage =
      `❌ *Appointment Cancelled*\n\n` +
      `🎫 *Appointment ID:* ${appointment.appointmentId}\n` +
      `📝 *Reason:* ${remarks || "Not specified"}\n\n` +
      `You can book a new appointment anytime.\n` +
      `Type *MENU* to see options.\n\n` +
      `Thank you! 🙏`;

    await whatsapp.sendText(appointment.phone, cancelMessage);

    return appointment;
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
}

module.exports = {
  createAppointment,
  getAppointmentStatus,
  getAppointmentsByPhone,
  confirmAppointment,
  cancelAppointment,
};
