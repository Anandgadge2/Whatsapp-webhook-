// backend/src/controllers/webhookController.js
const axios = require("axios");
const cloudinary = require("../config/cloudinary"); // keep your existing cloudinary config file
const Incident = require("../models/Incident");
const Officer = require("../models/Officer");
const Notification = require("../models/Notification");
const { assignAndNotify } = require("../services/assignmentService");
const whatsapp = require("../services/whatsappService");

// In-memory session store (simple). You can replace with Redis if you need persistence.
const userSessions = {};

/**
 * GET /webhook/whatsapp  (verification)
 */
exports.verify = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

/**
 * POST /webhook/whatsapp  (incoming messages)
 */
exports.receive = async (req, res) => {
  try {
    // Meta payload: iterate all entries/changes/messages (simplified to first message)
    const entries = req.body.entry || [];
    if (!entries.length) return res.sendStatus(200);

    // Process every message in each entry (but here we handle one)
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value || {};
        const messages = value.messages || [];
        const metadata = value.metadata || {};

        for (const m of messages) {
          const from = m.from; // sender number (without +)
          // If the sender is an officer (exists in Officer collection) handle officer replies
          const officer = await Officer.findOne({ whatsappNumber: from });

          // OFFICER FLOW (numeric commands)
          if (officer && m.type === "text") {
            const text = (m.text?.body || "").trim();
            await handleOfficerReply(officer, text);
            continue; // done with this message
          }

          // ---- CITIZEN FLOW ----
          // Initialize session on "hi"/"hello"
          if (m.type === "text") {
            const text = (m.text?.body || "").trim().toLowerCase();

            // start
            if (!userSessions[from] && (text === "hi" || text === "hello")) {
              userSessions[from] = {};
              await whatsapp.sendText(
                from,
`🌲 FOREST DEPARTMENT BOT

1. Illegal Tree Cutting
2. 🔥 Forest Fire
3. Injured Animal
4. General Complaint

Reply with a number (e.g. 2)`
              );
              continue;
            }

            // If user is in a step waiting for textual description (MESSAGE stage)
            const session = userSessions[from];
            if (session && session.stage === "MESSAGE") {
              // text is the descriptive message for the incident
              const description = m.text.body;

              // Create Incident with collected data
              const coords = session.location
                ? { type: "Point", coordinates: [Number(session.location.longitude), Number(session.location.latitude)] }
                : { type: "Point", coordinates: [0, 0] };

              const incident = await Incident.create({
                citizenNumber: from,
                location: coords,
                photoUrl: session.imageUrl || null,
                description,
                status: "pending"
              });

              // assign & notify officers (uses MySQL geofence -> Officer mapping)
              const result = await assignAndNotify(incident);

              // create notification entries already handled inside assignAndNotify, but we can emit realtime or send confirm
              await whatsapp.sendText(from, `✅ Complaint registered.\nID: ${incident._id}\nOfficer(s) notified.`);

              // cleanup session
              delete userSessions[from];
              continue;
            }

            // If user hasn't chosen a type yet and sends a number
            if (!session && ["1","2","3","4"].includes(text)) {
              const types = { "1": "ILLEGAL_CUTTING", "2": "FOREST_FIRE", "3": "INJURED_ANIMAL", "4": "GENERAL" };
              userSessions[from] = { type: types[text], stage: "LOCATION" };
              await whatsapp.sendText(from, "📍 Please send LIVE LOCATION (Share location)");
              continue;
            }

            // If session exists but user sends something unexpected, prompt them
            if (session && !["MESSAGE","IMAGE","LOCATION"].includes(session.stage)) {
              await whatsapp.sendText(from, "Please follow the steps. Send location when ready.");
              continue;
            }

            // If not matched above, ignore or instruct user
            await whatsapp.sendText(from, "Type *HI* to start a new report.");
            continue;
          }

          // LOCATION message
          if (m.type === "location") {
            const session = userSessions[from] || {};
            // If there's no session, start a new one with default type GENERAL
            if (!session.type) session.type = "GENERAL";
            session.location = {
              latitude: m.location.latitude,
              longitude: m.location.longitude
            };
            session.stage = "IMAGE";
            userSessions[from] = session;

            await whatsapp.sendText(from, "📸 Please send a photo of the incident (or type 'skip' to continue).");
            continue;
          }

          // IMAGE message
          if (m.type === "image") {
            // Need to fetch media URL from Graph API using media id
            const mediaId = m.image?.id;
            if (!mediaId) {
              await whatsapp.sendText(from, "Image ID not found, please resend the image.");
              continue;
            }

            try {
              // 1) Get media URL
              const mediaMetaResp = await axios.get(`https://graph.facebook.com/v17.0/${mediaId}`, {
                headers: { Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}` }
              });
              const mediaUrl = mediaMetaResp.data.url;
              if (!mediaUrl) throw new Error("Media URL not returned by Graph API");

              // 2) Download the image bytes
              const imageResp = await axios.get(mediaUrl, {
                responseType: "arraybuffer",
                headers: { Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}` }
              });

              // 3) Upload to Cloudinary (data URI upload)
              const b64 = Buffer.from(imageResp.data).toString("base64");
              const dataUri = `data:${imageResp.headers["content-type"]};base64,${b64}`;

              const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "forest-alerts" });

              // store in session
              const session = userSessions[from] || {};
              session.imageUrl = uploadResult.secure_url;
              session.stage = "MESSAGE";
              userSessions[from] = session;

              await whatsapp.sendText(from, "📝 Now please describe the situation (short text).");
            } catch (err) {
              console.error("Media handling error:", err?.response?.data || err.message);
              await whatsapp.sendText(from, "Failed to process the image. Please try again.");
            }

            continue;
          }

          // BUTTON/INTERACTIVE messages could be handled here if you use templates -- ignore for now
        } // end for messages
      } // end for changes
    } // end for entries

    // respond 200 to Meta
    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook processing error:", err);
    // still return 200 to avoid Meta retries; log error separately
    return res.sendStatus(200);
  }
};

/**
 * handleOfficerReply
 *
 * - Accepts an Officer document and a reply string (text)
 * - Finds the latest assigned incident in pending/accepted/in_progress states
 * - Updates incident status and updates Notification entries
 * - Sends confirmations to the officer (and optionally updates the citizen)
 */
async function handleOfficerReply(officer, reply) {
  try {
    reply = (reply || "").trim();

    // find latest assigned incident for this officer
    const incident = await Incident.findOne({
      assignedOfficers: officer._id,
      status: { $in: ["pending", "accepted", "in_progress"] }
    }).sort({ createdAt: -1 });

    if (!incident) {
      await whatsapp.sendText(officer.whatsappNumber, "No pending incident found to update.");
      return;
    }

    let newStatus = null;
    if (reply === "1") newStatus = "accepted";
    else if (reply === "2") newStatus = "declined";
    else if (reply === "3") newStatus = "completed";
    else if (reply === "4") newStatus = "in_progress";
    else {
      await whatsapp.sendText(
        officer.whatsappNumber,
        "Unknown command. Use:\n1 = Accept\n2 = Decline\n3 = Complete\n4 = In Progress"
      );
      return;
    }

    incident.status = newStatus;
    await incident.save();

    // Update notification(s) for this officer & incident
    await Notification.updateMany(
      { incidentId: incident._id, userId: officer._id },
      { status: newStatus === "accepted" ? "acknowledged" : newStatus }
    );

    // send confirmation to officer
    await whatsapp.sendText(officer.whatsappNumber, `Incident ${incident._id} updated to ${newStatus}.`);

    // Optionally notify citizen about status change (uncomment if desired)
    // await whatsapp.sendText(incident.citizenNumber, `Your report ${incident._id} is now ${newStatus}.`);

  } catch (err) {
    console.error("handleOfficerReply error:", err);
    try {
      await whatsapp.sendText(officer.whatsappNumber, "Failed to update incident. Try again later.");
    } catch (e) {
      console.error("Failed sending error message to officer:", e);
    }
  }
}
