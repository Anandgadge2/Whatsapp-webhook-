const axios = require("axios");

exports.sendMessage = async (to, message) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ User WhatsApp message sent:", to);

  } catch (err) {
    console.error("❌ WhatsApp Error:", err.response?.data || err.message);
  }
};
