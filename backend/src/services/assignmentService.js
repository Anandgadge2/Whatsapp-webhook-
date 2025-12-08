const { loadGeofences } = require("./geofenceService");
const { haversine, pointInPolygon } = require("./geoUtils");

const Officer = require("../models/Officer");
const Incident = require("../models/Incident");
const Notification = require("../models/Notification");
const whatsapp = require("./whatsappService");

async function assignAndNotify(incident) {
	const [lng, lat] = incident.location.coordinates;

	const geofences = await loadGeofences();

	let matches = [];

	for (let gf of geofences) {
		if (gf.type === "Circle") {
			let dist = haversine(lat, lng, gf.lat, gf.lng);
			if (dist <= gf.radius) matches.push(gf);
		} else if (gf.type === "Polygon" && gf.polygon) {
			if (pointInPolygon({ lat, lng }, gf.polygon)) matches.push(gf);
		}
	}

	if (matches.length === 0) {
		// nearest fallback
		let nearest = null;
		let min = Infinity;
		for (let gf of geofences) {
			let d = haversine(lat, lng, gf.lat, gf.lng);
			if (d < min) {
				min = d;
				nearest = gf;
			}
		}
		matches = [nearest];
	}

	// get officers for matched sites
	const officers = await Officer.find({
		sites: { $in: matches.map((g) => g.id) }
	});

	incident.assignedOfficers = officers.map((o) => o._id);
	await incident.save();

	for (let off of officers) {
		await Notification.create({
			userId: off._id,
			incidentId: incident._id,
			title: "New Incident Assigned",
			message: incident.description || "Incident reported"
		});

		await whatsapp.sendLocation(off.whatsappNumber, lat, lng);
		if (incident.photoUrl)
			await whatsapp.sendImage(off.whatsappNumber, incident.photoUrl);
		await whatsapp.sendText(
			off.whatsappNumber,
			`New Incident:\n${incident.description || "No description"}\nID: ${
				incident._id
			}\nReply:\n1 = Accept\n2 = Decline\n3 = Completed`
		);
	}

	return officers;
}

module.exports = { assignAndNotify };
