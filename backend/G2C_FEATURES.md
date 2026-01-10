# G2C (Government to Citizen) Features Implementation

## Overview

This WhatsApp chatbot now includes comprehensive G2C services for citizen engagement with government departments, implementing features from the Zilla Parishad Amravati G2C system.

## Key Features Implemented

### 1. **Grievance Registration** 📝

Citizens can register grievances through a conversational WhatsApp interface.

**Flow:**

1. User selects "📝 Register Grievance" from main menu
2. Selects category (Revenue, Water Supply, Road, Electricity, Sanitation, Other)
3. Enters full name
4. Describes the grievance
5. Sends location (optional - can skip)
6. Sends photo evidence (optional - can skip)
7. Receives auto-generated Grievance ID (e.g., GRV000001)
8. Gets automated acknowledgement with tracking details

**Features:**

- Auto-generated unique Grievance IDs
- Automated acknowledgement messages
- Location and photo attachment support
- Status tracking capability

### 2. **Application & Complaint Status Tracking** 📊

Citizens can track their grievances and appointments in real-time.

**Options:**

- **Grievance Status**: Enter Grievance ID to get current status
- **Appointment Status**: Enter Appointment ID to get booking details
- **My Applications**: View all recent grievances and appointments

**Status Updates:**

- PENDING ⏳
- IN_PROGRESS 🔄
- RESOLVED ✅
- REJECTED ❌

### 3. **Appointment Booking (Department-wise)** 📅

Citizens can book appointments with various government departments.

**Departments Available:**

- Revenue Department
- Water Supply Department
- Health Department
- Education Department
- Agriculture Department
- Other Departments

**Booking Flow:**

1. User selects "📅 Book Appointment"
2. Selects department
3. Describes purpose of visit
4. Enters full name
5. Enters preferred date (DD/MM/YYYY format)
6. Selects time slot (Morning/Afternoon/Evening)
7. Confirms booking
8. Receives auto-generated Appointment ID (e.g., APT000001)
9. Gets confirmation message

**Time Slots:**

- Morning (10AM-12PM)
- Afternoon (12PM-2PM)
- Evening (2PM-4PM)

### 4. **Automated Notifications & Acknowledgements** 🔔

All interactions trigger automated WhatsApp messages.

**Notification Types:**

- Grievance registration acknowledgement
- Appointment booking confirmation
- Status update notifications
- Appointment confirmation/cancellation alerts

## Database Models

### Grievance Model

```javascript
{
  grievanceId: String (auto-generated),
  userName: String,
  phone: String,
  category: String,
  description: String,
  location: { latitude, longitude, address },
  imageUrl: String,
  status: String (PENDING/IN_PROGRESS/RESOLVED/REJECTED),
  assignedOfficer: { name, phone, department },
  remarks: String,
  resolvedAt: Date,
  timestamps: true
}
```

### Appointment Model

```javascript
{
  appointmentId: String (auto-generated),
  userName: String,
  phone: String,
  department: String,
  purpose: String,
  preferredDate: Date,
  preferredTime: String,
  status: String (PENDING/CONFIRMED/CANCELLED/COMPLETED),
  confirmedDate: Date,
  confirmedTime: String,
  officerName: String,
  remarks: String,
  timestamps: true
}
```

## API Endpoints

### Grievance APIs

- `POST /api/grievances` - Create new grievance
- `GET /api/grievances/:grievanceId` - Get grievance by ID
- `GET /api/grievances/phone/:phone` - Get all grievances by phone
- `PUT /api/grievances/:grievanceId` - Update grievance status (Admin)
- `GET /api/grievances` - Get all grievances (Admin)

### Appointment APIs

- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:appointmentId` - Get appointment by ID
- `GET /api/appointments/phone/:phone` - Get all appointments by phone
- `PUT /api/appointments/:appointmentId/confirm` - Confirm appointment (Admin)
- `PUT /api/appointments/:appointmentId/cancel` - Cancel appointment (Admin)
- `GET /api/appointments` - Get all appointments (Admin)

## WhatsApp Interaction Flow

### Main Menu

Type `HI`, `HELLO`, `MENU`, or `START` to access:

```
🏛️ Welcome to G2C Services

Please select a service:
[📝 Register Grievance]
[📊 Track Status]
[📅 Book Appointment]
```

### Example Conversations

#### Grievance Registration

```
User: Hi
Bot: 🏛️ Welcome to G2C Services...
User: [Clicks "📝 Register Grievance"]
Bot: Select grievance category:
     [Revenue] [Water Supply] [Road]
User: [Clicks "Water Supply"]
Bot: 📝 Please enter your full name:
User: John Doe
Bot: 📝 Please describe your grievance in detail:
User: No water supply for 3 days in my area
Bot: 📍 Please send your location (or type 'skip')
User: [Sends location]
Bot: 📸 Please send a photo (or type 'skip'):
User: [Sends photo]
Bot: ✅ Grievance Registered Successfully
     📋 Grievance ID: GRV000001
     📂 Category: Water Supply
     📅 Date: 07/01/2026
     📊 Status: PENDING

     You can track your grievance status by sending:
     STATUS GRV000001
```

#### Status Tracking

```
User: Hi
Bot: 🏛️ Welcome to G2C Services...
User: [Clicks "📊 Track Status"]
Bot: What would you like to track?
     [Grievance Status] [Appointment Status] [My Applications]
User: [Clicks "Grievance Status"]
Bot: 📋 Please enter your Grievance ID (e.g., GRV000001):
User: GRV000001
Bot: 📋 Grievance Details

     ID: GRV000001
     Category: Water Supply
     Status: IN_PROGRESS
     Submitted: 07/01/2026
     Description: No water supply for 3 days in my area

     Remarks: Team dispatched to your area
```

## Admin Features

### Grievance Management

Admins can:

- View all grievances
- Update grievance status
- Assign officers
- Add remarks
- Mark as resolved/rejected

### Appointment Management

Admins can:

- View all appointments
- Confirm appointments with specific date/time
- Assign officers
- Cancel appointments with reason

## Automated Notifications

### For Citizens

- Grievance registration confirmation
- Grievance status updates
- Appointment booking confirmation
- Appointment confirmation with officer details
- Appointment cancellation notices

### For Officers

- New grievance assignment alerts
- Appointment confirmations
- Status update requirements

## Technical Implementation

### Services Layer

- `grievanceService.js` - Handles grievance CRUD and notifications
- `appointmentService.js` - Handles appointment CRUD and notifications
- `whatsappService.js` - WhatsApp message sending
- `buttonMessageService.js` - Interactive button messages

### Controllers Layer

- `grievanceController.js` - Grievance API endpoints
- `appointmentController.js` - Appointment API endpoints
- `buttonController.js` - Interactive menu generation
- `webhookController.js` - WhatsApp webhook handling

### Routes Layer

- `grievanceRoutes.js` - Grievance API routes
- `appointmentRoutes.js` - Appointment API routes

## Governance Alignment

This implementation aligns with the following governance principles:

1. **Self-service** - Citizens can register and track without visiting offices
2. **Application tracking** - Real-time status updates
3. **Status updates** - Automated notifications at each stage
4. **Humane & inclusive service delivery** - WhatsApp-based, no app download required
5. **No physical visits** - Complete process via WhatsApp
6. **Automated acknowledgements** - Instant confirmation messages

## Benefits

### For Citizens

- ✅ No need to visit government offices
- ✅ 24/7 service availability
- ✅ Real-time status tracking
- ✅ Automated acknowledgements
- ✅ No mobile app download required
- ✅ Simple WhatsApp interface

### For Government

- ✅ Reduced physical footfall
- ✅ Digital record keeping
- ✅ Improved citizen satisfaction
- ✅ Better resource allocation
- ✅ Data-driven decision making
- ✅ Transparent complaint handling

## Future Enhancements

Potential additions:

1. Multi-language support
2. Voice message support
3. Document upload capability
4. Payment integration
5. Feedback and rating system
6. Analytics dashboard
7. SMS fallback for non-WhatsApp users
8. Integration with existing government systems

## Security & Privacy

- All data stored securely in MongoDB
- Phone numbers used as unique identifiers
- No sensitive data exposed in messages
- Cloudinary for secure image storage
- HTTPS for all API communications

---

**Implementation Date:** January 7, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
