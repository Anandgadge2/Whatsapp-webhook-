// backend/src/controllers/webhookController.js

const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const Incident = require("../models/Incident");
const Officer = require("../models/Officer");
const Notification = require("../models/Notification");
const { assignAndNotify } = require("../services/assignmentService");
const whatsapp = require("../services/whatsappService");
const grievanceService = require("../services/grievanceService");
const appointmentService = require("../services/appointmentService");
const {
  getText,
  getUserLanguage,
  setUserLanguage,
} = require("../services/languageService");

// NEW IMPORT → Button message controller
const {
  sendLanguageMenu,
  sendMainMenu,
  sendGrievanceCategoryMenu,
  sendMoreGrievanceCategories,
  sendDepartmentMenu,
  sendMoreDepartments,
  sendTimeSlotMenu,
  sendStatusTrackingMenu,
  sendAppointmentConfirmMenu,
} = require("./buttonController");

// In-memory sessions
const userSessions = {};

/* ---------------------------------------------------------------------- */
/* VERIFY TOKEN (GET) */
/* ---------------------------------------------------------------------- */
exports.verify = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

/* ---------------------------------------------------------------------- */
/* RECEIVE WEBHOOK (POST) */
/* ---------------------------------------------------------------------- */
exports.receive = async (req, res) => {
  try {
    const entries = req.body.entry || [];
    if (!entries.length) return res.sendStatus(200);

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        const value = change.value || {};
        const messages = value.messages || [];

        for (const m of messages) {
          const from = m.from;

          /* --------------------------------------------------------------- */
          /* OFFICER FLOW */
          /* --------------------------------------------------------------- */
          const officer = await Officer.findOne({ whatsappNumber: from });
          if (officer && m.type === "text") {
            await handleOfficerReply(officer, m.text.body.trim());
            continue;
          }

          /* --------------------------------------------------------------- */
          /* BUTTON REPLY HANDLING (Interactive Messages) - G2C FEATURES */
          /* --------------------------------------------------------------- */
          if (m.type === "interactive") {
            const button = m.interactive.button_reply?.title;

            // Language Selection
            if (button === "English") {
              setUserLanguage(from, "en");
              await whatsapp.sendText(from, getText("en", "languageSet"));
              await sendMainMenu(from);
              continue;
            }

            if (button === "मराठी (Marathi)") {
              setUserLanguage(from, "mr");
              await whatsapp.sendText(from, getText("mr", "languageSet"));
              await sendMainMenu(from);
              continue;
            }

            const lang = getUserLanguage(from);


            // Appointment confirmation buttons
if (
  userSessions[from] &&
  userSessions[from].flow === "APPOINTMENT" &&
  userSessions[from].stage === "CONFIRM"
) {
  const lang = getUserLanguage(from);

  if (
    button === "✅ Confirm" ||
    button === "✅ पुष्टी करा"
  ) {
    await appointmentService.createAppointment({
      userName: userSessions[from].userName,
      phone: from,
      department: userSessions[from].department,
      purpose: userSessions[from].purpose,
      preferredDate: userSessions[from].preferredDate,
      preferredTime: userSessions[from].preferredTime,
    });

    delete userSessions[from];
    continue;
  }

  if (
    button === "❌ Cancel" ||
    button === "❌ रद्द करा"
  ) {
    delete userSessions[from];
    await whatsapp.sendText(from, getText(lang, "bookingCancelled"));
    continue;
  }
}


            // Main Menu Options - English
            if (
              button === "📝 Register Grievance" ||
              button === "📝 तक्रार नोंदवा"
            ) {
              await sendGrievanceCategoryMenu(from);
              userSessions[from] = { flow: "GRIEVANCE", stage: "CATEGORY" };
              continue;
            }

            if (button === "📊 Track Status" || button === "📊 स्थिती तपासा") {
              await sendStatusTrackingMenu(from);
              userSessions[from] = {
                flow: "TRACK_STATUS",
                stage: "SELECT_TYPE",
              };
              continue;
            }

            if (
              button === "📅 Book Appointment" ||
              button === "📅 भेटीची वेळ बुक करा"
            ) {
              await sendDepartmentMenu(from);
              userSessions[from] = { flow: "APPOINTMENT", stage: "DEPARTMENT" };
              continue;
            }

            // Grievance Categories - Both English and Marathi
            const grievanceCategories = [
              "Revenue",
              "महसूल",
              "Water Supply",
              "पाणीपुरवठा",
              "Road",
              "रस्ता",
              "Electricity",
              "वीज",
              "Sanitation",
              "स्वच्छता",
              "Other",
              "इतर",
            ];
            if (grievanceCategories.includes(button)) {
              // Map Marathi to English for storage
              const categoryMap = {
                महसूल: "Revenue",
                पाणीपुरवठा: "Water Supply",
                रस्ता: "Road",
                वीज: "Electricity",
                स्वच्छता: "Sanitation",
                इतर: "Other",
              };
              const category = categoryMap[button] || button;

              userSessions[from] = {
                flow: "GRIEVANCE",
                stage: "NAME",
                category: category,
              };
              await whatsapp.sendText(from, getText(lang, "enterName"));
              continue;
            }

            // Department Selection - Both English and Marathi
            const departments = [
              "Revenue Dept",
              "महसूल विभाग",
              "Water Supply Dept",
              "पाणीपुरवठा विभाग",
              "Health Dept",
              "आरोग्य विभाग",
              "Education Dept",
              "शिक्षण विभाग",
              "Agriculture Dept",
              "कृषी विभाग",
              "Other Dept",
              "इतर विभाग",
            ];
            if (departments.includes(button)) {
              // Map Marathi to English for storage
              const deptMap = {
                "महसूल विभाग": "Revenue",
                "पाणीपुरवठा विभाग": "Water Supply",
                "आरोग्य विभाग": "Health",
                "शिक्षण विभाग": "Education",
                "कृषी विभाग": "Agriculture",
                "इतर विभाग": "Other",
              };
              const deptName = button
                .replace(" Dept", "")
                .replace(" विभाग", "");
              const department = deptMap[button] || deptName;

              userSessions[from] = {
                flow: "APPOINTMENT",
                stage: "PURPOSE",
                department: department,
              };
              await whatsapp.sendText(from, getText(lang, "enterPurpose"));
              continue;
            }

            // Time Slots - Both English and Marathi
            const timeSlots = [
              "Morning (10AM-12PM)",
              "सकाळ (10AM-12PM)",
              "Afternoon (12PM-2PM)",
              "दुपार (12PM-2PM)",
              "Evening (2PM-4PM)",
              "संध्याकाळ (2PM-4PM)",
            ];
            if (timeSlots.includes(button)) {
              const session = userSessions[from];
              if (session && session.flow === "APPOINTMENT") {
                // Map Marathi to English for storage
                const timeMap = {
                  "सकाळ (10AM-12PM)": "Morning (10AM-12PM)",
                  "दुपार (12PM-2PM)": "Afternoon (12PM-2PM)",
                  "संध्याकाळ (2PM-4PM)": "Evening (2PM-4PM)",
                };
                const preferredTime = timeMap[button] || button;

                session.preferredTime = preferredTime;
                session.stage = "CONFIRM";
                userSessions[from] = session;

                const confirmMsg = getText(
                  lang,
                  "appointmentSummary",
                  session.userName,
                  session.department,
                  session.purpose,
                  new Date(session.preferredDate).toLocaleDateString(),
                  session.preferredTime
                );

                await sendAppointmentConfirmMenu(from, confirmMsg);
              }
              continue;
            }

            // Status Tracking Options - Both English and Marathi
            if (button === "Grievance Status" || button === "तक्रार स्थिती") {
              await whatsapp.sendText(from, getText(lang, "enterGrievanceId"));
              userSessions[from] = {
                flow: "TRACK_GRIEVANCE",
                stage: "ENTER_ID",
              };
              continue;
            }

            if (button === "Appointment Status" || button === "भेट स्थिती") {
              await whatsapp.sendText(
                from,
                getText(lang, "enterAppointmentId")
              );
              userSessions[from] = {
                flow: "TRACK_APPOINTMENT",
                stage: "ENTER_ID",
              };
              continue;
            }

            if (button === "My Applications" || button === "माझे अर्ज") {
              const grievances = await grievanceService.getGrievancesByPhone(
                from
              );
              const appointments =
                await appointmentService.getAppointmentsByPhone(from);

              let msg = `📊 *Your Applications*\n\n`;

              if (grievances.length > 0) {
                msg += `*Grievances:*\n`;
                grievances.slice(0, 5).forEach((g) => {
                  msg += `• ${g.grievanceId} - ${g.category} (${g.status})\n`;
                });
              }

              if (appointments.length > 0) {
                msg += `\n*Appointments:*\n`;
                appointments.slice(0, 5).forEach((a) => {
                  msg += `• ${a.appointmentId} - ${a.department} (${a.status})\n`;
                });
              }

              if (grievances.length === 0 && appointments.length === 0) {
                msg += `No applications found.`;
              }

              await whatsapp.sendText(from, msg);
              continue;
            }

            // Old forest fire buttons (keeping for backward compatibility)
            if (button === "Report Forest Fire") {
              userSessions[from] = { type: "FOREST_FIRE", stage: "LOCATION" };
              await whatsapp.sendText(from, "📍 Please send LIVE LOCATION.");
              continue;
            }

            if (button === "Report Animal Injury") {
              userSessions[from] = {
                type: "INJURED_ANIMAL",
                stage: "LOCATION",
              };
              await whatsapp.sendText(from, "📍 Please send LIVE LOCATION.");
              continue;
            }

            if (button === "Help") {
              await whatsapp.sendText(from, "How can I assist you?");
              continue;
            }
          }

          /* --------------------------------------------------------------- */
          /* CITIZEN FLOW (TEXT MESSAGES) */
          /* --------------------------------------------------------------- */
          if (m.type === "text") {
            const text = m.text.body.trim();
            const textLower = text.toLowerCase();
            const lang = getUserLanguage(from);

            // Trigger language/menu selection using hi / hello / menu / start
            if (
              ["hi", "hello", "menu", "start", "नमस्कार", "हॅलो"].includes(
                textLower
              )
            ) {
              // If no language set, show language menu first
              if (!lang || lang === "en") {
                await sendLanguageMenu(from);
              } else {
                await sendMainMenu(from);
              }
              continue;
            }

            const session = userSessions[from];

            /* ============================================================= */
            /* G2C GRIEVANCE FLOW */
            /* ============================================================= */
            if (session && session.flow === "GRIEVANCE") {
              // Stage: NAME
              if (session.stage === "NAME") {
                session.userName = text;
                session.stage = "DESCRIPTION";
                userSessions[from] = session;
                await whatsapp.sendText(
                  from,
                  getText(lang, "describeGrievance")
                );
                continue;
              }

              // Stage: DESCRIPTION
              if (session.stage === "DESCRIPTION") {
                session.description = text;
                session.stage = "LOCATION";
                userSessions[from] = session;
                await whatsapp.sendText(from, getText(lang, "sendLocation"));
                continue;
              }

              // Stage: SKIP LOCATION
              if (session.stage === "LOCATION" && textLower === "skip") {
                session.stage = "IMAGE";
                userSessions[from] = session;
                await whatsapp.sendText(from, getText(lang, "sendPhoto"));
                continue;
              }

              // Stage: SKIP IMAGE
              if (session.stage === "IMAGE" && textLower === "skip") {
                // Create grievance without image
                const grievance = await grievanceService.createGrievance({
                  userName: session.userName,
                  phone: from,
                  category: session.category,
                  description: session.description,
                  location: session.location || {},
                });

                delete userSessions[from];
                continue;
              }
            }

            /* ============================================================= */
            /* G2C APPOINTMENT FLOW */
            /* ============================================================= */
            if (session && session.flow === "APPOINTMENT") {
              // Stage: PURPOSE
              if (session.stage === "PURPOSE") {
                session.purpose = text;
                session.stage = "NAME";
                userSessions[from] = session;
                await whatsapp.sendText(from, getText(lang, "enterFullName"));
                continue;
              }

              // Stage: NAME
              if (session.stage === "NAME") {
                session.userName = text;
                session.stage = "DATE";
                userSessions[from] = session;
                await whatsapp.sendText(from, getText(lang, "enterDate"));
                continue;
              }

              // Stage: DATE
              if (session.stage === "DATE") {
                try {
                  const parts = text.split("/");
                  if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1;
                    const year = parseInt(parts[2]);
                    const date = new Date(year, month, day);

                    if (date > new Date()) {
                      session.preferredDate = date;
                      session.stage = "TIME";
                      userSessions[from] = session;
                      await sendTimeSlotMenu(from);
                      continue;
                    } else {
                      await whatsapp.sendText(
                        from,
                        getText(lang, "invalidDate")
                      );
                      continue;
                    }
                  } else {
                    await whatsapp.sendText(
                      from,
                      getText(lang, "invalidFormat")
                    );
                    continue;
                  }
                } catch (error) {
                  await whatsapp.sendText(from, getText(lang, "invalidFormat"));
                  continue;
                }
              }

              // Stage: CONFIRM
              // if (session.stage === "CONFIRM") {
              //   if (textLower === "confirm") {
              //     const appointment =
              //       await appointmentService.createAppointment({
              //         userName: session.userName,
              //         phone: from,
              //         department: session.department,
              //         purpose: session.purpose,
              //         preferredDate: session.preferredDate,
              //         preferredTime: session.preferredTime,
              //       });

              //     delete userSessions[from];
              //     continue;
              //   } else if (textLower === "cancel") {
              //     delete userSessions[from];
              //     await whatsapp.sendText(
              //       from,
              //       getText(lang, "bookingCancelled")
              //     );
              //     continue;
              //   } else {
              //     await whatsapp.sendText(
              //       from,
              //       getText(lang, "confirmOrCancel")
              //     );
              //     continue;
              //   }
              // }
            }

            /* ============================================================= */
            /* G2C STATUS TRACKING */
            /* ============================================================= */
            if (
              session &&
              session.flow === "TRACK_GRIEVANCE" &&
              session.stage === "ENTER_ID"
            ) {
              const grievanceId = text.toUpperCase();
              const grievance = await grievanceService.getGrievanceStatus(
                grievanceId
              );

              if (grievance) {
                const statusMsg = getText(lang, "grievanceDetails", grievance);
                await whatsapp.sendText(from, statusMsg);
              } else {
                await whatsapp.sendText(
                  from,
                  getText(lang, "grievanceNotFound")
                );
              }

              delete userSessions[from];
              continue;
            }

            if (
              session &&
              session.flow === "TRACK_APPOINTMENT" &&
              session.stage === "ENTER_ID"
            ) {
              const appointmentId = text.toUpperCase();
              const appointment = await appointmentService.getAppointmentStatus(
                appointmentId
              );

              if (appointment) {
                const statusMsg = getText(
                  lang,
                  "appointmentDetails",
                  appointment
                );
                await whatsapp.sendText(from, statusMsg);
              } else {
                await whatsapp.sendText(
                  from,
                  getText(lang, "appointmentNotFound")
                );
              }

              delete userSessions[from];
              continue;
            }

            // Existing "MESSAGE" stage → user typing description (old flow)
            if (session && session.stage === "MESSAGE") {
              const description = m.text.body;

              const coords = session.location
                ? {
                    type: "Point",
                    coordinates: [
                      Number(session.location.longitude),
                      Number(session.location.latitude),
                    ],
                  }
                : { type: "Point", coordinates: [0, 0] };

              const incident = await Incident.create({
                citizenNumber: from,
                location: coords,
                photoUrl: session.imageUrl || null,
                description,
                status: "pending",
              });

              await assignAndNotify(incident);
              await whatsapp.sendText(
                from,
                `✅ Complaint registered.\nID: ${incident._id}`
              );

              delete userSessions[from];
              continue;
            }

            // If user manually sends numbers 1–4 (old flow still works)
            if (!session && ["1", "2", "3", "4"].includes(textLower)) {
              const types = {
                1: "ILLEGAL_CUTTING",
                2: "FOREST_FIRE",
                3: "INJURED_ANIMAL",
                4: "GENERAL",
              };

              userSessions[from] = {
                type: types[textLower],
                stage: "LOCATION",
              };
              await whatsapp.sendText(from, "📍 Please send LIVE LOCATION.");
              continue;
            }

            // If no valid command
            await whatsapp.sendText(from, "Type *HI* to get the main menu.");
            continue;
          }

          /* --------------------------------------------------------------- */
          /* LOCATION MESSAGE */
          /* --------------------------------------------------------------- */
          if (m.type === "location") {
            const session = userSessions[from] || {};

            // G2C Grievance Flow
            if (session.flow === "GRIEVANCE" && session.stage === "LOCATION") {
              session.location = {
                latitude: m.location.latitude,
                longitude: m.location.longitude,
              };
              session.stage = "IMAGE";
              userSessions[from] = session;

              await whatsapp.sendText(
                from,
                "📸 Please send a photo (or type 'skip'):"
              );
              continue;
            }

            // Legacy Incident Flow
            if (!session.type) session.type = "GENERAL";

            session.location = {
              latitude: m.location.latitude,
              longitude: m.location.longitude,
            };
            session.stage = "IMAGE";
            userSessions[from] = session;

            await whatsapp.sendText(
              from,
              "📸 Send a photo of the incident (or type 'skip')."
            );
            continue;
          }

          /* --------------------------------------------------------------- */
          /* IMAGE MESSAGE */
          /* --------------------------------------------------------------- */
          if (m.type === "image") {
            const mediaId = m.image?.id;
            if (!mediaId) {
              await whatsapp.sendText(
                from,
                "Image not received. Please resend."
              );
              continue;
            }

            try {
              const mediaMeta = await axios.get(
                `https://graph.facebook.com/v17.0/${mediaId}`,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
                  },
                }
              );

              const mediaUrl = mediaMeta.data.url;

              const img = await axios.get(mediaUrl, {
                responseType: "arraybuffer",
                headers: {
                  Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
                },
              });

              const base64 = Buffer.from(img.data).toString("base64");
              const dataUri = `data:${img.headers["content-type"]};base64,${base64}`;

              const uploaded = await cloudinary.uploader.upload(dataUri, {
                folder: "g2c-grievances",
              });

              const session = userSessions[from] || {};
              session.imageUrl = uploaded.secure_url;

              // G2C Grievance Flow - Submit immediately after image
              if (session.flow === "GRIEVANCE" && session.stage === "IMAGE") {
                const grievance = await grievanceService.createGrievance({
                  userName: session.userName,
                  phone: from,
                  category: session.category,
                  description: session.description,
                  location: session.location || {},
                  imageUrl: session.imageUrl,
                });

                delete userSessions[from];
                continue;
              }

              // Legacy Incident Flow
              session.stage = "MESSAGE";
              userSessions[from] = session;

              await whatsapp.sendText(
                from,
                "📝 Please describe the situation."
              );
            } catch (err) {
              await whatsapp.sendText(from, "Image upload failed. Try again.");
            }

            continue;
          }
        } // messages
      } // changes
    } // entries

    return res.sendStatus(200);
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.sendStatus(200);
  }
};

/* ---------------------------------------------------------------------- */
/* OFFICER HANDLING LOGIC */
/* ---------------------------------------------------------------------- */
async function handleOfficerReply(officer, reply) {
  try {
    reply = reply.trim();

    const incident = await Incident.findOne({
      assignedOfficers: officer._id,
      status: { $in: ["pending", "accepted", "in_progress"] },
    }).sort({ createdAt: -1 });

    if (!incident) {
      await whatsapp.sendText(officer.whatsappNumber, "No incident found.");
      return;
    }

    let statusMap = {
      1: "accepted",
      2: "declined",
      3: "completed",
      4: "in_progress",
    };

    const newStatus = statusMap[reply];
    if (!newStatus) {
      await whatsapp.sendText(
        officer.whatsappNumber,
        "Use:\n1 Accept\n2 Decline\n3 Complete\n4 In Progress"
      );
      return;
    }

    incident.status = newStatus;
    await incident.save();

    await Notification.updateMany(
      { incidentId: incident._id, userId: officer._id },
      { status: newStatus }
    );

    await whatsapp.sendText(officer.whatsappNumber, `Updated: ${newStatus}`);
  } catch (err) {
    console.error("Officer update error:", err);
  }
}
