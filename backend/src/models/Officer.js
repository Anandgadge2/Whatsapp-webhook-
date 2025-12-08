const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	whatsappNumber: { type: String, required: true }, // No '+'
	sites: { type: [Number], default: [] }, // MySQL site_ids
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Officer", officerSchema);
