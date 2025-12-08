const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      default: "Anonymous"
    },

    phone: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "Forest"
    },

    message: {
      type: String
    },

    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },

    imageUrl: {
      type: String
    },

    officerName: {
      type: String,
      default: "Not Assigned"
    },

    officerPhone: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
