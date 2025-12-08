// // src/controllers/incidentController.js
// const Incident = require('../models/Incident');
// const { assignIncident } = require('../services/assignmentService');

// async function reportIncident(req, res) {
//   try {
//     const { lat, lng, photoUrl, description, citizenNumber } = req.body;
//     if (!lat || !lng || !citizenNumber) {
//       return res.status(400).json({ error: 'lat, lng and citizenNumber required' });
//     }

//     const incident = await Incident.create({
//       citizenNumber,
//       location: { type: 'Point', coordinates: [lng, lat] },
//       photoUrl,
//       description,
//       status: 'pending'
//     });

//     await assignIncident(incident);

//     return res.json({ message: 'Incident received', incidentId: incident._id });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// }

// module.exports = { reportIncident };


const Incident = require("../models/Incident");
const { assignAndNotify } = require("../services/assignmentService");

exports.reportIncident = async (req, res) => {
	try {
		const { lat, lng, photoUrl, description, citizenNumber } = req.body;

		const incident = await Incident.create({
			citizenNumber,
			location: { type: "Point", coordinates: [lng, lat] },
			photoUrl,
			description
		});

		await assignAndNotify(incident);

		res.json({
			message: "Incident created & officers notified",
			incidentId: incident._id
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
};
