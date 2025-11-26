const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },

    type: { type: String, required: true }, // animal, fire, cutting, general

    message: { type: String },

    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String }
    },
imageUrl: { type: String }
,
    status: {
      type: String,
      default: "pending" // pending / processing / resolved
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
