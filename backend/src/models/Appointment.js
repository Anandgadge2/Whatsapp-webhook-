const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      unique: true,
    },

    userName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      enum: [
        "Revenue",
        "Water Supply",
        "Road",
        "Health",
        "Education",
        "Agriculture",
        "Other",
      ],
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    preferredDate: {
      type: Date,
      required: true,
    },

    preferredTime: {
      type: String,
      enum: [
        "Morning (10AM-12PM)",
        "Afternoon (12PM-2PM)",
        "Evening (2PM-4PM)",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
    },

    confirmedDate: Date,
    confirmedTime: String,
    officerName: String,

    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

/* --------------------------------------------------
   AUTO-GENERATE APPOINTMENT ID (CORRECT)
-------------------------------------------------- */
AppointmentSchema.pre("validate", async function () {
  if (!this.appointmentId) {
    try {
      const count = await mongoose.model("Appointment").countDocuments();
      this.appointmentId = `APT${String(count + 1).padStart(6, "0")}`;
    } catch (err) {
      this.appointmentId = `APT${Date.now().toString().slice(-6)}`;
    }
  }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
