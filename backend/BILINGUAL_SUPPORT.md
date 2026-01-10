# Bilingual Support Implementation (English & Marathi)

## Overview

The WhatsApp G2C chatbot now supports both **English** and **Marathi** languages, allowing citizens to interact in their preferred language.

## Features

### Language Selection

- **First-time users** see a language selection menu when they type `HI`, `HELLO`, `MENU`, or `START`
- **Marathi users** can also use `नमस्कार` or `हॅलो` to trigger the menu
- Users can select:
  - **English** - All responses in English
  - **मराठी (Marathi)** - All responses in Marathi

### Language Persistence

- Once a language is selected, all subsequent interactions use that language
- Language preference is stored in memory for the session
- Users can change language anytime by typing `MENU`

## Bilingual Components

### 1. **Main Menu**

**English:**

```
🏛️ Welcome to G2C Services

Please select a service:
[📝 Register Grievance]
[📊 Track Status]
[📅 Book Appointment]
```

**Marathi:**

```
🏛️ जी२सी सेवांमध्ये आपले स्वागत आहे

कृपया सेवा निवडा:
[📝 तक्रार नोंदवा]
[📊 स्थिती तपासा]
[📅 भेटीची वेळ बुक करा]
```

### 2. **Grievance Categories**

| English      | Marathi    |
| ------------ | ---------- |
| Revenue      | महसूल      |
| Water Supply | पाणीपुरवठा |
| Road         | रस्ता      |
| Electricity  | वीज        |
| Sanitation   | स्वच्छता   |
| Other        | इतर        |

### 3. **Departments**

| English           | Marathi          |
| ----------------- | ---------------- |
| Revenue Dept      | महसूल विभाग      |
| Water Supply Dept | पाणीपुरवठा विभाग |
| Health Dept       | आरोग्य विभाग     |
| Education Dept    | शिक्षण विभाग     |
| Agriculture Dept  | कृषी विभाग       |
| Other Dept        | इतर विभाग        |

### 4. **Time Slots**

| English              | Marathi             |
| -------------------- | ------------------- |
| Morning (10AM-12PM)  | सकाळ (10AM-12PM)    |
| Afternoon (12PM-2PM) | दुपार (12PM-2PM)    |
| Evening (2PM-4PM)    | संध्याकाळ (2PM-4PM) |

### 5. **Status Tracking Options**

| English            | Marathi       |
| ------------------ | ------------- |
| Grievance Status   | तक्रार स्थिती |
| Appointment Status | भेट स्थिती    |
| My Applications    | माझे अर्ज     |

## Message Translations

### Grievance Registration Flow

#### English:

1. "📝 Please enter your full name:"
2. "📝 Please describe your grievance in detail:"
3. "📍 Please send your location (or type 'skip' if not applicable):"
4. "📸 Please send a photo (or type 'skip'):"
5. "✅ Grievance Registered Successfully..."

#### Marathi:

1. "📝 कृपया आपले पूर्ण नाव प्रविष्ट करा:"
2. "📝 कृपया आपल्या तक्रारीचे तपशीलवार वर्णन करा:"
3. "📍 कृपया आपले स्थान पाठवा (किंवा लागू नसल्यास 'skip' टाइप करा):"
4. "📸 कृपया फोटो पाठवा (किंवा 'skip' टाइप करा):"
5. "✅ तक्रार यशस्वीरित्या नोंदवली..."

### Appointment Booking Flow

#### English:

1. "📝 Please describe the purpose of your appointment:"
2. "👤 Please enter your full name:"
3. "📅 Please enter preferred date (DD/MM/YYYY):"
4. "⏰ Select Time Slot..."
5. "✅ Appointment Summary..."
6. "Type _CONFIRM_ to book or _CANCEL_ to abort."

#### Marathi:

1. "📝 कृपया आपल्या भेटीचा उद्देश सांगा:"
2. "👤 कृपया आपले पूर्ण नाव प्रविष्ट करा:"
3. "📅 कृपया इच्छित तारीख प्रविष्ट करा (DD/MM/YYYY):"
4. "⏰ वेळ निवडा..."
5. "✅ भेटीचा सारांश..."
6. "बुक करण्यासाठी _CONFIRM_ किंवा रद्द करण्यासाठी _CANCEL_ टाइप करा."

### Error Messages

| English                                                      | Marathi                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| ❌ Please enter a future date. Try again:                    | ❌ कृपया भविष्यातील तारीख प्रविष्ट करा. पुन्हा प्रयत्न करा:        |
| ❌ Invalid format. Please use DD/MM/YYYY:                    | ❌ अवैध स्वरूप. कृपया DD/MM/YYYY वापरा:                            |
| ❌ Grievance not found. Please check the ID and try again.   | ❌ तक्रार सापडली नाही. कृपया क्रमांक तपासा आणि पुन्हा प्रयत्न करा. |
| ❌ Appointment not found. Please check the ID and try again. | ❌ भेट सापडली नाही. कृपया क्रमांक तपासा आणि पुन्हा प्रयत्न करा.    |

## Technical Implementation

### Language Service (`languageService.js`)

```javascript
// Get text in user's language
getText(lang, "mainMenu");

// Get user's preferred language
getUserLanguage(phone);

// Set user's language
setUserLanguage(phone, "mr"); // or 'en'
```

### Translation Structure

All translations are stored in a centralized object:

```javascript
const translations = {
  en: {
    /* English translations */
  },
  mr: {
    /* Marathi translations */
  },
};
```

### Button Mapping

Buttons work in both languages:

- English buttons map to English storage values
- Marathi buttons map to English storage values (for database consistency)
- Example: "महसूल" → "Revenue" (stored in database)

## Usage Examples

### Example 1: Marathi Grievance Registration

```
User: नमस्कार
Bot: 🌐 Welcome to G2C Services / जी२सी सेवांमध्ये आपले स्वागत आहे
     [English] [मराठी (Marathi)]

User: [Clicks मराठी (Marathi)]
Bot: ✅ भाषा मराठी मध्ये सेट केली
     🏛️ जी२सी सेवांमध्ये आपले स्वागत आहे
     [📝 तक्रार नोंदवा] [📊 स्थिती तपासा] [📅 भेटीची वेळ बुक करा]

User: [Clicks तक्रार नोंदवा]
Bot: 📝 तक्रार नोंदणी
     [महसूल] [पाणीपुरवठा] [रस्ता]

User: [Clicks पाणीपुरवठा]
Bot: 📝 कृपया आपले पूर्ण नाव प्रविष्ट करा:

User: राजेश पाटील
Bot: 📝 कृपया आपल्या तक्रारीचे तपशीलवार वर्णन करा:

User: माझ्या भागात 3 दिवसांपासून पाणीपुरवठा नाही
Bot: 📍 कृपया आपले स्थान पाठवा (किंवा लागू नसल्यास 'skip' टाइप करा):

User: [Sends location]
Bot: 📸 कृपया फोटो पाठवा (किंवा 'skip' टाइप करा):

User: skip
Bot: ✅ तक्रार यशस्वीरित्या नोंदवली
     📋 तक्रार क्रमांक: GRV000001
     📂 प्रकार: Water Supply
     📅 तारीख: 07/01/2026
     📊 स्थिती: प्रलंबित

     तुम्ही तुमच्या तक्रारीची स्थिती पाठवून तपासू शकता:
     STATUS GRV000001

     आमची सेवा वापरल्याबद्दल धन्यवाद! 🙏
```

### Example 2: English Appointment Booking

```
User: Hi
Bot: 🌐 Welcome to G2C Services / जी२सी सेवांमध्ये आपले स्वागत आहे
     [English] [मराठी (Marathi)]

User: [Clicks English]
Bot: ✅ Language set to English
     🏛️ Welcome to G2C Services
     [📝 Register Grievance] [📊 Track Status] [📅 Book Appointment]

User: [Clicks Book Appointment]
Bot: 🏛️ Book Appointment
     [Revenue Dept] [Water Supply Dept] [Health Dept]

User: [Clicks Health Dept]
Bot: 📝 Please describe the purpose of your appointment:

User: Medical certificate for school admission
Bot: 👤 Please enter your full name:

User: Priya Sharma
Bot: 📅 Please enter preferred date (DD/MM/YYYY):

User: 15/01/2026
Bot: ⏰ Select Time Slot
     [Morning (10AM-12PM)] [Afternoon (12PM-2PM)] [Evening (2PM-4PM)]

User: [Clicks Morning (10AM-12PM)]
Bot: ✅ Appointment Summary
     👤 Name: Priya Sharma
     🏛️ Department: Health
     📝 Purpose: Medical certificate for school admission
     📅 Date: 15/01/2026
     ⏰ Time: Morning (10AM-12PM)

     Type *CONFIRM* to book or *CANCEL* to abort.

User: CONFIRM
Bot: ✅ Appointment Booked Successfully
     🎫 Appointment ID: APT000001
     ...
```

## Data Storage

- **User Language Preference**: Stored in memory (userLanguages object)
- **Database Values**: Always stored in English for consistency
- **Display Values**: Translated based on user's language preference

## Benefits

### For Citizens

✅ Can use their preferred language (English or Marathi)
✅ Better understanding and accessibility
✅ Increased adoption in rural areas
✅ Inclusive service delivery

### For Government

✅ Wider reach across different demographics
✅ Better citizen engagement
✅ Compliance with regional language requirements
✅ Improved service satisfaction

## Future Enhancements

- Add more regional languages (Hindi, Gujarati, etc.)
- Voice message support in regional languages
- Auto-detect language from user's first message
- Persistent language storage in database
- Admin panel to manage translations

---

**Implementation Date:** January 7, 2026
**Languages Supported:** English, Marathi (मराठी)
**Status:** Production Ready ✅
