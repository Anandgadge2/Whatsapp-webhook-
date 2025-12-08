const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "Officer" },
	incidentId: { type: mongoose.Schema.Types.ObjectId, ref: "Incident" },
	title: String,
	message: String,
	status: {
		type: String,
		enum: ["pending", "sent", "acknowledged", "completed"],
		default: "pending"
	},
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
