// backend/src/services/buttonMessageService.js

const axios = require("axios");
const { GRAPH_API_TOKEN, PHONE_NUMBER_ID } = process.env;

const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

async function sendButtonMessage(to, bodyText, buttons = []) {
  /*
      buttons example:
      [
        { type: "quick_reply", title: "Report Issue" },
        { type: "quick_reply", title: "Track Status" },
        { type: "quick_reply", title: "Help" }
      ]
  */

  const mappedButtons = buttons.map((btn, index) => {
    if (btn.type === "quick_reply") {
      return {
        type: "reply",
        reply: {
          id: `btn_${index + 1}`,
          title: btn.title
        }
      };
    }

    if (btn.type === "url") {
      return {
        type: "url",
        url: {
          title: btn.title,
          url: btn.url
        }
      };
    }

    if (btn.type === "phone") {
      return {
        type: "phone_number",
        phone_number: {
          title: btn.title,
          phone_number: btn.phone_number
        }
      };
    }

    throw new Error("Invalid button type", btn);
  });

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: bodyText
      },
      action: {
        buttons: mappedButtons
      }
    }
  };

  try {
    const response = await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Failed to send button message:", error.response?.data || error);
    throw error;
  }
}

module.exports = { sendButtonMessage };
