// Language translations for English and Marathi

const translations = {
  en: {
    // Language Selection
    selectLanguage:
      "🌐 *Welcome to G2C Services*\n\nPlease select your language:",
    languageSet: "✅ Language set to English",

    // Main Menu
    mainMenu: "🏛️ *Welcome to G2C Services*\n\nPlease select a service:",
    registerGrievance: "📝 Register Grievance",
    trackStatus: "📊 Track Status",
    bookAppointment: "📅 Book Appointment",
    changeLanguage: "🌐 Change Language",

    // Grievance Flow
    grievanceCategory:
      "📝 *Grievance Registration*\n\nSelect grievance category:",
    categoryRevenue: "Revenue",
    categoryWaterSupply: "Water Supply",
    categoryRoad: "Road",
    categoryElectricity: "Electricity",
    categorySanitation: "Sanitation",
    categoryOther: "Other",

    enterName: "📝 Please enter your full name:",
    describeGrievance: "📝 Please describe your grievance in detail:",
    sendLocation:
      "📍 Please send your location (or type 'skip' if not applicable):",
    sendPhoto: "📸 Please send a photo (or type 'skip'):",

    grievanceSuccess: (id, category, date) =>
      `✅ *Grievance Registered Successfully*\n\n` +
      `📋 *Grievance ID:* ${id}\n` +
      `📂 *Category:* ${category}\n` +
      `📅 *Date:* ${date}\n` +
      `📊 *Status:* PENDING\n\n` +
      `You can track your grievance status by sending:\n` +
      `*STATUS ${id}*\n\n` +
      `Thank you for using our service! 🙏`,

    // Appointment Flow
    selectDepartment: "🏛️ *Book Appointment*\n\nSelect department:",
    deptRevenue: "Revenue Dept",
    deptWaterSupply: "Water Supply Dept",
    deptHealth: "Health Dept",
    deptEducation: "Education Dept",
    deptAgriculture: "Agriculture Dept",
    deptOther: "Other Dept",

    enterPurpose: "📝 Please describe the purpose of your appointment:",
    enterFullName: "👤 Please enter your full name:",
    enterDate: "📅 Please enter preferred date (DD/MM/YYYY):",
    selectTimeSlot: "⏰ *Select Time Slot*\n\nChoose your preferred time:",
    timeMorning: "Morning (10AM-12PM)",
    timeAfternoon: "Afternoon (12PM-2PM)",
    timeEvening: "Evening (2PM-4PM)",

    appointmentSummary: (name, dept, purpose, date, time) =>
      `✅ *Appointment Summary*\n\n` +
      `👤 Name: ${name}\n` +
      `🏛️ Department: ${dept}\n` +
      `📝 Purpose: ${purpose}\n` +
      `📅 Date: ${date}\n` +
      `⏰ Time: ${time}\n\n` +
      `Please confirm or cancel using the buttons below.`,

    appointmentSuccess: (id, dept, date, time) =>
      `✅ *Appointment Booked Successfully*\n\n` +
      `🎫 *Appointment ID:* ${id}\n` +
      `🏛️ *Department:* ${dept}\n` +
      `📅 *Preferred Date:* ${date}\n` +
      `⏰ *Preferred Time:* ${time}\n` +
      `📊 *Status:* PENDING\n\n` +
      `You will receive a confirmation message once your appointment is confirmed.\n\n` +
      `Track your appointment by sending:\n` +
      `*APPOINTMENT ${id}*\n\n` +
      `Thank you! 🙏`,

    // Status Tracking
    trackingMenu: "📊 *Track Status*\n\nWhat would you like to track?",
    grievanceStatus: "Grievance Status",
    appointmentStatus: "Appointment Status",
    myApplications: "My Applications",

    enterGrievanceId: "📋 Please enter your Grievance ID (e.g., GRV000001):",
    enterAppointmentId:
      "🎫 Please enter your Appointment ID (e.g., APT000001):",

    grievanceDetails: (g) =>
      `📋 *Grievance Details*\n\n` +
      `ID: ${g.grievanceId}\n` +
      `Category: ${g.category}\n` +
      `Status: ${g.status}\n` +
      `Submitted: ${new Date(g.createdAt).toLocaleDateString()}\n` +
      `Description: ${g.description}\n` +
      (g.remarks ? `\nRemarks: ${g.remarks}` : ""),

    appointmentDetails: (a) =>
      `🎫 *Appointment Details*\n\n` +
      `ID: ${a.appointmentId}\n` +
      `Department: ${a.department}\n` +
      `Status: ${a.status}\n` +
      `Preferred Date: ${new Date(a.preferredDate).toLocaleDateString()}\n` +
      `Preferred Time: ${a.preferredTime}\n` +
      (a.status === "CONFIRMED"
        ? `\n✅ Confirmed Date: ${new Date(
            a.confirmedDate
          ).toLocaleDateString()}\n` +
          `Confirmed Time: ${a.confirmedTime}\n` +
          `Officer: ${a.officerName}`
        : ""),

    // Common Messages
    invalidDate: "❌ Please enter a future date. Try again:",
    invalidFormat: "❌ Invalid format. Please use DD/MM/YYYY:",
    confirmOrCancel: "Please type *CONFIRM* or *CANCEL*:",
    bookingCancelled:
      "❌ Appointment booking cancelled. Type *MENU* to start again.",
    grievanceNotFound:
      "❌ Grievance not found. Please check the ID and try again.",
    appointmentNotFound:
      "❌ Appointment not found. Please check the ID and try again.",
    typeMenu: "Type *HI* to get the main menu.",
    noApplications: "No applications found.",
    yourApplications: "📊 *Your Applications*\n\n",
    grievancesLabel: "*Grievances:*\n",
    appointmentsLabel: "\n*Appointments:*\n",
    confirmAppointment: "✅ Confirm",
cancelAppointment: "❌ Cancel",

  },

  mr: {
    // Language Selection
    selectLanguage:
      "🌐 *जी२सी सेवांमध्ये आपले स्वागत आहे*\n\nकृपया आपली भाषा निवडा:",
    languageSet: "✅ भाषा मराठी मध्ये सेट केली",

    // Main Menu
    mainMenu: "🏛️ *जी२सी सेवांमध्ये आपले स्वागत आहे*\n\nकृपया सेवा निवडा:",
    registerGrievance: "📝 तक्रार नोंदवा",
    trackStatus: "📊 स्थिती तपासा",
    bookAppointment: "📅 भेटीची वेळ बुक करा",
    changeLanguage: "🌐 भाषा बदला",

    // Grievance Flow
    grievanceCategory: "📝 *तक्रार नोंदणी*\n\nतक्रारीचा प्रकार निवडा:",
    categoryRevenue: "महसूल",
    categoryWaterSupply: "पाणीपुरवठा",
    categoryRoad: "रस्ता",
    categoryElectricity: "वीज",
    categorySanitation: "स्वच्छता",
    categoryOther: "इतर",

    enterName: "📝 कृपया आपले पूर्ण नाव प्रविष्ट करा:",
    describeGrievance: "📝 कृपया आपल्या तक्रारीचे तपशीलवार वर्णन करा:",
    sendLocation:
      "📍 कृपया आपले स्थान पाठवा (किंवा लागू नसल्यास 'skip' टाइप करा):",
    sendPhoto: "📸 कृपया फोटो पाठवा (किंवा 'skip' टाइप करा):",

    grievanceSuccess: (id, category, date) =>
      `✅ *तक्रार यशस्वीरित्या नोंदवली*\n\n` +
      `📋 *तक्रार क्रमांक:* ${id}\n` +
      `📂 *प्रकार:* ${category}\n` +
      `📅 *तारीख:* ${date}\n` +
      `📊 *स्थिती:* प्रलंबित\n\n` +
      `तुम्ही तुमच्या तक्रारीची स्थिती पाठवून तपासू शकता:\n` +
      `*STATUS ${id}*\n\n` +
      `आमची सेवा वापरल्याबद्दल धन्यवाद! 🙏`,

    // Appointment Flow
    selectDepartment: "🏛️ *भेटीची वेळ बुक करा*\n\nविभाग निवडा:",
    deptRevenue: "महसूल विभाग",
    deptWaterSupply: "पाणीपुरवठा विभाग",
    deptHealth: "आरोग्य विभाग",
    deptEducation: "शिक्षण विभाग",
    deptAgriculture: "कृषी विभाग",
    deptOther: "इतर विभाग",

    enterPurpose: "📝 कृपया आपल्या भेटीचा उद्देश सांगा:",
    enterFullName: "👤 कृपया आपले पूर्ण नाव प्रविष्ट करा:",
    enterDate: "📅 कृपया इच्छित तारीख प्रविष्ट करा (DD/MM/YYYY):",
    selectTimeSlot: "⏰ *वेळ निवडा*\n\nआपली इच्छित वेळ निवडा:",
    timeMorning: "सकाळ (10AM-12PM)",
    timeAfternoon: "दुपार (12PM-2PM)",
    timeEvening: "संध्याकाळ (2PM-4PM)",

    appointmentSummary: (name, dept, purpose, date, time) =>
      `✅ *भेटीचा सारांश*\n\n` +
      `👤 नाव: ${name}\n` +
      `🏛️ विभाग: ${dept}\n` +
      `📝 उद्देश: ${purpose}\n` +
      `📅 तारीख: ${date}\n` +
      `⏰ वेळ: ${time}\n\n` +
      `बुक करण्यासाठी *CONFIRM* किंवा रद्द करण्यासाठी *CANCEL* टाइप करा.`,

    appointmentSuccess: (id, dept, date, time) =>
      `✅ *भेट यशस्वीरित्या बुक झाली*\n\n` +
      `🎫 *भेट क्रमांक:* ${id}\n` +
      `🏛️ *विभाग:* ${dept}\n` +
      `📅 *इच्छित तारीख:* ${date}\n` +
      `⏰ *इच्छित वेळ:* ${time}\n` +
      `📊 *स्थिती:* प्रलंबित\n\n` +
      `तुमची भेट पुष्टी झाल्यावर तुम्हाला संदेश मिळेल.\n\n` +
      `तुमची भेट पाठवून तपासा:\n` +
      `*APPOINTMENT ${id}*\n\n` +
      `धन्यवाद! 🙏`,

    // Status Tracking
    trackingMenu: "📊 *स्थिती तपासा*\n\nतुम्हाला काय तपासायचे आहे?",
    grievanceStatus: "तक्रार स्थिती",
    appointmentStatus: "भेट स्थिती",
    myApplications: "माझे अर्ज",

    enterGrievanceId:
      "📋 कृपया तुमचा तक्रार क्रमांक प्रविष्ट करा (उदा., GRV000001):",
    enterAppointmentId:
      "🎫 कृपया तुमचा भेट क्रमांक प्रविष्ट करा (उदा., APT000001):",

    grievanceDetails: (g) =>
      `📋 *तक्रार तपशील*\n\n` +
      `क्रमांक: ${g.grievanceId}\n` +
      `प्रकार: ${g.category}\n` +
      `स्थिती: ${g.status}\n` +
      `सबमिट केले: ${new Date(g.createdAt).toLocaleDateString()}\n` +
      `वर्णन: ${g.description}\n` +
      (g.remarks ? `\nटिप्पणी: ${g.remarks}` : ""),

    appointmentDetails: (a) =>
      `🎫 *भेट तपशील*\n\n` +
      `क्रमांक: ${a.appointmentId}\n` +
      `विभाग: ${a.department}\n` +
      `स्थिती: ${a.status}\n` +
      `इच्छित तारीख: ${new Date(a.preferredDate).toLocaleDateString()}\n` +
      `इच्छित वेळ: ${a.preferredTime}\n` +
      (a.status === "CONFIRMED"
        ? `\n✅ पुष्टी केलेली तारीख: ${new Date(
            a.confirmedDate
          ).toLocaleDateString()}\n` +
          `पुष्टी केलेली वेळ: ${a.confirmedTime}\n` +
          `अधिकारी: ${a.officerName}`
        : ""),

    // Common Messages
    invalidDate: "❌ कृपया भविष्यातील तारीख प्रविष्ट करा. पुन्हा प्रयत्न करा:",
    invalidFormat: "❌ अवैध स्वरूप. कृपया DD/MM/YYYY वापरा:",
    confirmOrCancel: "कृपया *CONFIRM* किंवा *CANCEL* टाइप करा:",
    bookingCancelled:
      "❌ भेट बुकिंग रद्द केले. पुन्हा सुरू करण्यासाठी *MENU* टाइप करा.",
    grievanceNotFound:
      "❌ तक्रार सापडली नाही. कृपया क्रमांक तपासा आणि पुन्हा प्रयत्न करा.",
    appointmentNotFound:
      "❌ भेट सापडली नाही. कृपया क्रमांक तपासा आणि पुन्हा प्रयत्न करा.",
    typeMenu: "मुख्य मेनू मिळवण्यासाठी *HI* टाइप करा.",
    noApplications: "कोणतेही अर्ज आढळले नाहीत.",
    yourApplications: "📊 *तुमचे अर्ज*\n\n",
    grievancesLabel: "*तक्रारी:*\n",
    appointmentsLabel: "\n*भेटी:*\n",
    confirmAppointment: "✅ पुष्टी करा",
cancelAppointment: "❌ रद्द करा",

  },
};

/**
 * Get translation for a key in specified language
 */
function getText(lang, key, ...args) {
  const language = lang === "mr" ? "mr" : "en";
  const text = translations[language][key];

  if (typeof text === "function") {
    return text(...args);
  }

  return text || translations.en[key] || key;
}

/**
 * Get user's preferred language (default: English)
 */
const userLanguages = {};

function getUserLanguage(phone) {
  return userLanguages[phone] || "en";
}

function setUserLanguage(phone, lang) {
  userLanguages[phone] = lang;
}

module.exports = {
  getText,
  getUserLanguage,
  setUserLanguage,
  translations,
};
