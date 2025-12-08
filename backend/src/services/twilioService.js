const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.notifyOfficer = async (message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_FROM,
      to: process.env.OFFICER_PHONE,
    });

    console.log("✅ Twilio message sent to officer:", response.sid);
  } catch (error) {
    console.error("❌ Twilio error:", error.message);
  }
};
