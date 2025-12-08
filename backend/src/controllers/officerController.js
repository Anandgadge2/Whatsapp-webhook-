// // src/controllers/officerController.js
// const Officer = require('../models/Officer');

// async function createOfficer(req, res) {
//   const { name, whatsappNumber, polygon } = req.body;
//   if (!name || !whatsappNumber || !polygon) {
//     return res.status(400).json({ error: 'name, whatsappNumber, polygon required' });
//   }

//   // polygon should be GeoJSON Polygon: { type: 'Polygon', coordinates: [...] }
//   const officer = await Officer.create({
//     name,
//     whatsappNumber,
//     serviceArea: polygon
//   });

//   return res.json({ message: 'Officer created', officer });
// }

// module.exports = { createOfficer };


const Officer = require("../models/Officer");

exports.createOfficer = async (req, res) => {
	try {
		const { name, whatsappNumber, sites } = req.body;
		const officer = await Officer.create({
			name,
			whatsappNumber,
			sites: sites || []
		});
		res.json(officer);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Error creating officer" });
	}
};

exports.getOfficers = async (req, res) => {
	const officers = await Officer.find();
	res.json(officers);
};
