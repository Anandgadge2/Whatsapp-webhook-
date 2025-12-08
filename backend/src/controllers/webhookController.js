const whatsappService = require("../services/whatsappService");
const Complaint = require("../models/Complaint");
const cloudinary = require("../config/cloudinary");
const axios = require("axios");

// In-memory session
const userSessions = {};

// ========================= VERIFY =========================
exports.verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
};

// ========================= MAIN HANDLER =========================
exports.handleIncomingMessage = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body?.toLowerCase();
    const userState = userSessions[from];
    const io = req.app.get("io");

    // ========================= START =========================
    if (!userState && (text === "hi" || text === "hello")) {
      userSessions[from] = {};

      await whatsappService.sendMessage(
        from,
`🌲 FOREST DEPARTMENT BOT

1. Illegal Tree Cutting
2. 🔥 Forest Fire
3. Injured Animal
4. General Complaint

Reply with a number`
      );

      return res.sendStatus(200);
    }

    // ========================= SELECT TYPE =========================
    if (["1", "2", "3", "4"].includes(text)) {
      const types = {
        "1": "ILLEGAL_CUTTING",
        "2": "FOREST_FIRE",
        "3": "INJURED_ANIMAL",
        "4": "GENERAL"
      };

      userSessions[from] = { type: types[text], stage: "LOCATION" };

      await whatsappService.sendMessage(from, "📍 Send LIVE LOCATION");
      return res.sendStatus(200);
    }

    // ========================= LOCATION =========================
    if (message.location && userState?.stage === "LOCATION") {
      userState.location = message.location;
      userState.stage = "IMAGE";

      await whatsappService.sendMessage(from, "📸 Send a photo of the incident");
      return res.sendStatus(200);
    }

    // ========================= IMAGE =========================
    if (message.image && userState?.stage === "IMAGE") {
      const mediaId = message.image.id;

      const media = await axios.get(
        `https://graph.facebook.com/v18.0/${mediaId}`,
        { headers: { Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}` } }
      );

      const imageFile = await axios.get(media.data.url, {
        responseType: "arraybuffer",
        headers: { Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}` }
      });

      const upload = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${Buffer.from(imageFile.data).toString("base64")}`,
        { folder: "forest-alerts" }
      );

      userState.imageUrl = upload.secure_url;
      userState.stage = "MESSAGE";

      await whatsappService.sendMessage(from, "📝 Describe the situation");
      return res.sendStatus(200);
    }

    // ========================= FINAL MESSAGE =========================
    if (userState?.stage === "MESSAGE" && text) {
      const complaint = await Complaint.create({
        phone: from,
        type: userState.type,
        message: text,
        location: userState.location,
        imageUrl: userState.imageUrl,
        status: "PENDING"
      });

      const officerNumber = process.env.OFFICER_PHONE?.trim();

      console.log("✅ Officer number from .env:", officerNumber);
      console.log("✅ User number:", from);

      // ✅ Only send to OFFICER (never the user)
      if (officerNumber && officerNumber !== from) {

        console.log("✅ Sending complaint to officer:", officerNumber);

        await twilioService.notifyOfficer(
          `🚨 NEW COMPLAINT

Type: ${complaint.type}

From: ${complaint.phone}

Location: https://maps.google.com?q=${complaint.location.latitude},${complaint.location.longitude}

Image: ${complaint.imageUrl}

Message: ${complaint.message}

ID: ${complaint._id}`
        );
      }

      // ✅ Realtime dashboard
      if (io) io.emit("new-complaint", complaint);

      // ✅ User confirmation only (NO DETAILS)
      await whatsappService.sendMessage(
        from,
        `✅ Complaint Registered
ID: ${complaint._id}
Officer notified.`
      );

      delete userSessions[from];
      return res.sendStatus(200);
    }

    // ========================= FALLBACK =========================
    await whatsappService.sendMessage(from, "Type *HI* to start");
    return res.sendStatus(200);

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return res.sendStatus(500);
  }
};
