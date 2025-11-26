const whatsappService = require('../services/whatsappService');
const Complaint = require('../models/Complaint');

const axios = require("axios");
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// In-memory user session store
const userSessions = {};

// ==============================
// VERIFY WEBHOOK
// ==============================
const verifyWebhook = (req, res) => {
  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log("✅ Webhook verified");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  return res.sendStatus(400);
};

// ==============================
// HANDLE INCOMING MESSAGES
// ==============================
const handleIncomingMessage = async (req, res) => {
  const body = req.body;

  console.log("📩 Incoming webhook:\n", JSON.stringify(body, null, 2));

  if (
    body.object &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages
  ) {

    const message = body.entry[0].changes[0].value.messages[0];
    const from = message.from;
    const rawText = message.text?.body?.trim() || "";
    const msgBody = rawText.toLowerCase();
    const userState = userSessions[from];
    const io = req.app.get("io");

    try {

      // ===============================================
      // 1. HANDLE LOCATION
      // ===============================================
      if (message.location && userState?.type) {

        const { latitude, longitude, name, address } = message.location;

        userSessions[from].location = {
          latitude,
          longitude,
          address: address || name || "Unknown"
        };

        await whatsappService.sendMessage(
          from,
          `✅ Location received

Latitude: ${latitude}
Longitude: ${longitude}

Now please send:
📸 A photo OR
📝 Additional details`
        );

        return res.sendStatus(200);
      }

      // ===============================================
      // 2. HANDLE IMAGE (FIXED 401 + CLOUDINARY)
      // ===============================================
      if (message.image && userState?.type) {
        try {
          const imageId = message.image.id;
          const token = process.env.GRAPH_API_TOKEN;

          // Step 1: Get media URL from Meta
          const mediaResponse = await axios.get(
            `https://graph.facebook.com/v17.0/${imageId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const mediaUrl = mediaResponse.data.url;

          // Step 2: Download image as buffer (WITH TOKEN)
          const imageBuffer = await axios.get(
            mediaUrl,
            {
              responseType: "arraybuffer",
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          // Step 3: Upload to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${Buffer.from(imageBuffer.data).toString("base64")}`,
            {
              folder: "forest_department"
            }
          );

          // Step 4: Save complaint in MongoDB
          const complaint = await Complaint.create({
            phone: from,
            type: userState.type,
            message: userState.message || "Image evidence submitted",
            location: userState.location || undefined,
            imageUrl: uploadResult.secure_url,
            status: "pending"
          });

          if (io) {
            io.emit("new-complaint", complaint);
          }

          await whatsappService.sendMessage(
            from,
            `✅ Photo received successfully

Your complaint has been registered.

Reference ID: ${complaint._id}

Forest officers are reviewing it.`
          );

          delete userSessions[from];
          return res.sendStatus(200);

        } catch (error) {
          console.error("❌ Image processing error:", error.message);

          await whatsappService.sendMessage(
            from,
            "❌ Failed to process your image. Please resend the photo."
          );

          return res.sendStatus(200);
        }
      }

      // ===============================================
      // 3. HANDLE TEXT AFTER OPTION SELECTED
      // ===============================================
      if (userState?.waitingForText) {

        const complaint = await Complaint.create({
          phone: from,
          type: userState.type,
          message: rawText,
          location: userState.location || undefined,
          status: "pending"
        });

        if (io) {
          io.emit("new-complaint", complaint);
        }

        await whatsappService.sendMessage(
          from,
          `✅ Your complaint has been recorded successfully.

Reference ID: ${complaint._id}

Our officer will review it shortly.`
        );

        delete userSessions[from];
        return res.sendStatus(200);
      }

      // ===============================================
      // 4. MAIN MENU
      // ===============================================
      if (msgBody === "hi" || msgBody === "hello") {
        const reply = `🌲 FOREST DEPARTMENT CONTROL CENTER 🌲

Reply with a number:

1️⃣ Illegal tree cutting
2️⃣ Forest fire
3️⃣ Injured animal
4️⃣ General complaint
5️⃣ Talk to officer`;

        await whatsappService.sendMessage(from, reply);
        return res.sendStatus(200);
      }

      // ===============================================
      // 5. MENU OPTIONS
      // ===============================================

      // OPTION 1 - Illegal cutting
      if (msgBody === "1") {
        userSessions[from] = { 
          type: "illegal_cutting",
          waitingForText: true
        };

        const reply = `🌳 ILLEGAL TREE CUTTING REPORT

Please send ALL of the following:
📍 Location (GPS / Area)
📸 Photo of the incident (required)
🕒 Time of incident (if known)

You can also attach a photo directly.`;

        await whatsappService.sendMessage(from, reply);
        return res.sendStatus(200);
      }

      // OPTION 2 - Forest Fire
      if (msgBody === "2") {
        userSessions[from] = { 
          type: "forest_fire",
          waitingForLocation: true
        };

        const reply = `🔥 FOREST FIRE EMERGENCY 🚨

Please SHARE your live location now:
Tap 📎 → Location → Send current location

Then send:
📸 Photo of the fire (if safe)
📝 Any additional details`;

        await whatsappService.sendMessage(from, reply);
        return res.sendStatus(200);
      }

      // OPTION 3 - Injured Animal
      if (msgBody === "3") {
        userSessions[from] = { 
          type: "injured_animal",
          waitingForLocation: true
        };

        const reply = `🐾 INJURED ANIMAL REPORT

Please send in this order:

1️⃣ 📍 Live location (tap 📎 → Location)
2️⃣ 🐾 Animal type (Dog / Monkey / Deer, etc.)
3️⃣ 📸 Photo of the animal
4️⃣ 💬 Condition (bleeding, unconscious, etc.)`;

        await whatsappService.sendMessage(from, reply);
        return res.sendStatus(200);
      }

      // OPTION 4 - General Complaint
      if (msgBody === "4") {
        userSessions[from] = { 
          type: "general",
          waitingForText: true
        };

        const reply = `📝 GENERAL COMPLAINT

Please send:
📍 Location
📑 Your issue
📸 Optional photo

We will register and assign an officer.`;

        await whatsappService.sendMessage(from, reply);
        return res.sendStatus(200);
      }

      // OPTION 5 - Officer Contact
      if (msgBody === "5") {
        const reply = `👮 Forest Department Officer

Name: Mr. Sharma
Contact: +91-98XXXXXX21
Email: officer@forest.gov

Working Hours:
09:00 AM – 06:00 PM`;

        await whatsappService.sendMessage(from, reply);
        return res.sendStatus(200);
      }

      // ===============================================
      // 6. FALLBACK
      // ===============================================

      await whatsappService.sendMessage(
        from,
        `Invalid option.

Type *Hi* to restart the menu.`
      );

      return res.sendStatus(200);


    } catch (error) {
      console.error("❌ Webhook Handler Error:", error.message);
      return res.sendStatus(500);
    }
  }

  return res.sendStatus(200);
};

module.exports = {
  verifyWebhook,
  handleIncomingMessage
};
