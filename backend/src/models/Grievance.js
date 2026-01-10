const mongoose = require("mongoose");

const GrievanceSchema = new mongoose.Schema(
  {
    grievanceId: {
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

    category: {
      type: String,
      enum: [
        "Revenue",
        "Water Supply",
        "Road",
        "Electricity",
        "Sanitation",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },

    imageUrl: String,

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },

    assignedOfficer: {
      name: String,
      phone: String,
      department: String,
    },

    remarks: {
      type: String,
      default: "",
    },

    resolvedAt: Date,
  },
  { timestamps: true }
);

/* --------------------------------------------------
   AUTO-GENERATE GRIEVANCE ID (CORRECT)
-------------------------------------------------- */
GrievanceSchema.pre("validate", async function () {
  if (!this.grievanceId) {
    try {
      const count = await mongoose.model("Grievance").countDocuments();
      this.grievanceId = `GRV${String(count + 1).padStart(6, "0")}`;
    } catch (err) {
      this.grievanceId = `GRV${Date.now().toString().slice(-6)}`;
    }
  }
});

module.exports = mongoose.model("Grievance", GrievanceSchema);
