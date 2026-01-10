// backend/src/controllers/buttonController.js

const { sendButtonMessage } = require("../services/buttonMessageService");
const { getText, getUserLanguage } = require("../services/languageService");

/**
 * Send language selection menu
 */
async function sendLanguageMenu(userNumber) {
  return await sendButtonMessage(
    userNumber,
    "🌐 *Welcome to G2C Services / जी२सी सेवांमध्ये आपले स्वागत आहे*\n\nPlease select your language / कृपया आपली भाषा निवडा:",
    [
      { type: "quick_reply", title: "English" },
      { type: "quick_reply", title: "मराठी (Marathi)" },
    ]
  );
}

/**
 * Send main menu with G2C services
 */
async function sendMainMenu(userNumber) {
  const lang = getUserLanguage(userNumber);

  return await sendButtonMessage(userNumber, getText(lang, "mainMenu"), [
    { type: "quick_reply", title: getText(lang, "registerGrievance") },
    { type: "quick_reply", title: getText(lang, "trackStatus") },
    { type: "quick_reply", title: getText(lang, "bookAppointment") },
  ]);
}

/**
 * Send grievance category menu
 */
async function sendGrievanceCategoryMenu(userNumber) {
  const lang = getUserLanguage(userNumber);

  return await sendButtonMessage(
    userNumber,
    getText(lang, "grievanceCategory"),
    [
      { type: "quick_reply", title: getText(lang, "categoryRevenue") },
      { type: "quick_reply", title: getText(lang, "categoryWaterSupply") },
      { type: "quick_reply", title: getText(lang, "categoryRoad") },
    ]
  );
}

/**
 * Send more grievance categories
 */
async function sendMoreGrievanceCategories(userNumber) {
  const lang = getUserLanguage(userNumber);

  return await sendButtonMessage(
    userNumber,
    getText(lang, "grievanceCategory"),
    [
      { type: "quick_reply", title: getText(lang, "categoryElectricity") },
      { type: "quick_reply", title: getText(lang, "categorySanitation") },
      { type: "quick_reply", title: getText(lang, "categoryOther") },
    ]
  );
}

/**
 * Send department menu for appointments
 */
async function sendDepartmentMenu(userNumber) {
  const lang = getUserLanguage(userNumber);

  return await sendButtonMessage(
    userNumber,
    getText(lang, "selectDepartment"),
    [
      { type: "quick_reply", title: getText(lang, "deptRevenue") },
      { type: "quick_reply", title: getText(lang, "deptWaterSupply") },
      { type: "quick_reply", title: getText(lang, "deptHealth") },
    ]
  );
}

/**
 * Send more departments
 */
async function sendMoreDepartments(userNumber) {
  const lang = getUserLanguage(userNumber);

  return await sendButtonMessage(
    userNumber,
    getText(lang, "selectDepartment"),
    [
      { type: "quick_reply", title: getText(lang, "deptEducation") },
      { type: "quick_reply", title: getText(lang, "deptAgriculture") },
      { type: "quick_reply", title: getText(lang, "deptOther") },
    ]
  );
}

/**
 * Send time slot menu
 */
async function sendTimeSlotMenu(userNumber) {
  const lang = getUserLanguage(userNumber);

  return await sendButtonMessage(userNumber, getText(lang, "selectTimeSlot"), [
    { type: "quick_reply", title: getText(lang, "timeMorning") },
    { type: "quick_reply", title: getText(lang, "timeAfternoon") },
    { type: "quick_reply", title: getText(lang, "timeEvening") },
  ]);
}

/**
 * Send status tracking menu
 */
async function sendStatusTrackingMenu(userNumber) {
  const lang = getUserLanguage(userNumber);

  return await sendButtonMessage(userNumber, getText(lang, "trackingMenu"), [
    { type: "quick_reply", title: getText(lang, "grievanceStatus") },
    { type: "quick_reply", title: getText(lang, "appointmentStatus") },
    { type: "quick_reply", title: getText(lang, "myApplications") },
  ]);
}


/**
 * Send appointment confirmation buttons
 */
async function sendAppointmentConfirmMenu(userNumber, summaryText) {
  const lang = getUserLanguage(userNumber);

  return await sendButtonMessage(userNumber, summaryText, [
    {
      type: "quick_reply",
      title: getText(lang, "confirmAppointment") || "✅ Confirm",
    },
    {
      type: "quick_reply",
      title: getText(lang, "cancelAppointment") || "❌ Cancel",
    },
  ]);
}

module.exports = {
  sendLanguageMenu,
  sendMainMenu,
  sendGrievanceCategoryMenu,
  sendMoreGrievanceCategories,
  sendDepartmentMenu,
  sendMoreDepartments,
  sendTimeSlotMenu,
  sendStatusTrackingMenu,
  sendAppointmentConfirmMenu,
};
