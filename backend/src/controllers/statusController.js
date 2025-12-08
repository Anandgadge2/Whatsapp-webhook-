const Incident = require("../models/Incident");
const Notification = require("../models/Notification");

exports.updateStatus = async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	const inc = await Incident.findById(id);
	if (!inc) return res.status(404).json({ error: "Incident not found" });

	inc.status = status;
	await inc.save();

	await Notification.updateMany(
		{ incidentId: inc._id },
		{ status }
	);

	res.json({ message: "Status updated", incident: inc });
};
