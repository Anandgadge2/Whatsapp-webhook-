// const axios = require("axios");

// exports.sendMessage = async (to, message) => {
//   try {
//     const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

//     await axios.post(
//       url,
//       {
//         messaging_product: "whatsapp",
//         to,
//         text: { body: message },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("✅ User WhatsApp message sent:", to);

//   } catch (err) {
//     console.error("❌ WhatsApp Error:", err.response?.data || err.message);
//   }
// };

const axios = require("axios");

const TOKEN = process.env.GRAPH_API_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;

async function sendText(to, body) {
	return axios.post(
		`https://graph.facebook.com/v17.0/${PHONE_ID}/messages`,
		{
			messaging_product: "whatsapp",
			to,
			type: "text",
			text: { body }
		},
		{ headers: { Authorization: `Bearer ${TOKEN}` } }
	);
}

async function sendImage(to, link) {
	return axios.post(
		`https://graph.facebook.com/v17.0/${PHONE_ID}/messages`,
		{
			messaging_product: "whatsapp",
			to,
			type: "image",
			image: { link }
		},
		{ headers: { Authorization: `Bearer ${TOKEN}` } }
	);
}

async function sendLocation(to, lat, lng) {
	return axios.post(
		`https://graph.facebook.com/v17.0/${PHONE_ID}/messages`,
		{
			messaging_product: "whatsapp",
			to,
			type: "location",
			location: {
				latitude: String(lat),
				longitude: String(lng),
				name: "Incident Location",
				address: "Reported via Alert"
			}
		},
		{ headers: { Authorization: `Bearer ${TOKEN}` } }
	);
}

module.exports = { sendText, sendImage, sendLocation };
