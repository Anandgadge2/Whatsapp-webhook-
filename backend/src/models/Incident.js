const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
	citizenNumber: { type: String, required: true },
	location: {
		type: { type: String, enum: ["Point"], required: true },
		coordinates: { type: [Number], required: true } // [lng, lat]
	},
	photoUrl: String,
	description: String,
	assignedOfficers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Officer" }],
	status: {
		type: String,
		enum: ["pending", "in_progress", "completed"],
		default: "pending"
	},
	createdAt: { type: Date, default: Date.now }
});

incidentSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Incident", incidentSchema);
