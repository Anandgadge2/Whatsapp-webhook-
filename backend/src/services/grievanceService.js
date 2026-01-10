const mongoose = require("mongoose");
const Grievance = require("../models/Grievance");
const whatsapp = require("./whatsappService");
const { getText, getUserLanguage } = require("./languageService");

/**
 * Create a new grievance and send acknowledgement
 */
async function createGrievance(data) {
  try {
    // Ensure MongoDB is connected before creating
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }
    
    const grievance = new Grievance(data);
    await grievance.save();
    
    const lang = getUserLanguage(data.phone);

    // Send acknowledgement to citizen
    const ackMessage = getText(
      lang,
      "grievanceSuccess",
      grievance.grievanceId,
      grievance.category,
      new Date().toLocaleDateString()
    );

    await whatsapp.sendText(data.phone, ackMessage);

    return grievance;
  } catch (error) {
    console.error("Error creating grievance:", error);
    throw error;
  }
}

/**
 * Get grievance status by ID
 */
async function getGrievanceStatus(grievanceId) {
  try {
    const grievance = await Grievance.findOne({ grievanceId });

    if (!grievance) {
      return null;
    }

    return grievance;
  } catch (error) {
    console.error("Error fetching grievance:", error);
    throw error;
  }
}

/**
 * Get all grievances by phone number
 */
async function getGrievancesByPhone(phone) {
  try {
    const grievances = await Grievance.find({ phone }).sort({ createdAt: -1 });
    return grievances;
  } catch (error) {
    console.error("Error fetching grievances:", error);
    throw error;
  }
}

/**
 * Update grievance status and notify citizen
 */
async function updateGrievanceStatus(grievanceId, status, remarks = "") {
  try {
    const grievance = await Grievance.findOneAndUpdate(
      { grievanceId },
      {
        status,
        remarks,
        ...(status === "RESOLVED" && { resolvedAt: new Date() }),
      },
      { new: true }
    );

    if (!grievance) {
      return null;
    }

    // Send notification to citizen
    const statusEmoji = {
      PENDING: "⏳",
      IN_PROGRESS: "🔄",
      RESOLVED: "✅",
      REJECTED: "❌",
    };

    const notificationMessage =
      `${statusEmoji[status]} *Grievance Status Updated*\n\n` +
      `📋 *Grievance ID:* ${grievance.grievanceId}\n` +
      `📊 *New Status:* ${status}\n` +
      `📝 *Remarks:* ${remarks || "N/A"}\n` +
      `📅 *Updated:* ${new Date().toLocaleString()}\n\n` +
      `Thank you for your patience! 🙏`;

    await whatsapp.sendText(grievance.phone, notificationMessage);

    return grievance;
  } catch (error) {
    console.error("Error updating grievance:", error);
    throw error;
  }
}

module.exports = {
  createGrievance,
  getGrievanceStatus,
  getGrievancesByPhone,
  updateGrievanceStatus,
};
