# WhatsApp Automation System (Node.js + Cloud API)

A Node.js-based WhatsApp automation backend powered by the WhatsApp Cloud API. This system uses secure webhooks to receive user messages, supports structured conversations, handles images and location media, stores data in MongoDB, and broadcasts real-time events via WebSockets (Socket.IO). It is designed to be scalable, modular, and production-ready.

---

## 📚 Documentation

### Getting Started

- **[System Overview](./SYSTEM_OVERVIEW.md)** - Complete system architecture and real-life use cases
- **[Quick Start Guide](./QUICK_START.md)** - Get started in 15 minutes

### Deployment & Production

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Deploy to Heroku, Railway, Render, VPS, or Docker
- **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist for production readiness

### API & Integration

- **[Meta API Guide](./META_API_GUIDE.md)** - Complete WhatsApp Business API reference with examples

### Configuration

- **[Environment Variables](./.env.example)** - Template for all environment variables

---

## 🚀 Features

- WhatsApp Cloud API integration
- Secure webhook verification
- Interactive message-based automation
- Image handling and Cloudinary integration
- Live location capture (latitude & longitude)
- MongoDB data storage
- Real-time updates using Socket.IO
- Scalable & modular Node.js architecture
- Production-ready error handling

---

## 🧰 Tech Stack

**Backend**

- Node.js
- Express.js

**Database**

- MongoDB + Mongoose

**Media Storage**

- Cloudinary

**APIs**

- WhatsApp Cloud API (Meta Graph API)

**Realtime**

- Socket.IO / WebSockets

**Development Tools**

- Nodemon
- Ngrok (for local webhook testing)

---

## 📁 Folder Structure

```
Whatsapp Webhook/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── webhookController.js
│   │   ├── routes/
│   │   │   └── webhookRoutes.js
│   │   ├── services/
│   │   │   └── whatsappService.js
│   │   ├── models/
│   │   │   └── Complaint.js
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env (ignored)
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=3000

GRAPH_API_TOKEN=YOUR_WHATSAPP_TOKEN
PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID
WEBHOOK_VERIFY_TOKEN=ANY_SECRET

MONGODB_URI=mongodb://127.0.0.1:27017/your_database_name

CLOUDINARY_CLOUD_NAME=YOUR_NAME
CLOUDINARY_API_KEY=YOUR_KEY
CLOUDINARY_API_SECRET=YOUR_SECRET
```

> 📌 Important: Do not push `.env` to GitHub. It is already ignored by `.gitignore`.

---

## 📦 Installation

Move into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Running the Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Expected output:

```
✅ MongoDB connected
🚀 Server running on port 3000
```

---

## 🌐 Expose Webhook (for WhatsApp Meta)

You must expose your local server using **ngrok**:

```bash
ngrok http 3000
```

Copy the HTTPS URL and configure it in Meta Developer Console as:

```
https://YOUR-NGROK-URL/webhook
```

---

## 🔁 Message Flow (How it works)

1. User sends message on WhatsApp
2. WhatsApp triggers webhook
3. Server receives data:

   - Text
   - Location
   - Image

4. Media is fetched using Meta token
5. Image is uploaded to Cloudinary
6. Data is stored in MongoDB
7. Event is broadcast to frontend using Socket.IO
8. User receives confirmation message

---

## 🗄 Sample Database Document

```json
{
  "phone": "91XXXXXXXXXX",
  "type": "general",
  "message": "Issue details here",
  "location": {
    "latitude": 21.110882,
    "longitude": 79.0628241
  },
  "imageUrl": "https://res.cloudinary.com/xxxx/image/upload/...",
  "status": "pending",
  "createdAt": "2025-11-26T12:00:00Z"
}
```

---

## 📡 WebSocket Test (Realtime Monitoring)

Use this HTML file to test Socket.IO:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>WebSocket Test</title>
  </head>
  <body>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script>
      const socket = io("http://localhost:3000");
      socket.on("connect", () => console.log("Connected:", socket.id));
      socket.on("new-complaint", (data) => console.log("New data:", data));
    </script>
  </body>
</html>
```

---

## ✅ What Makes This System Strong

- Secure token validation
- Scalable architecture
- Structured data storage
- Real-time communication
- Cloud-based image storage
- Works with any frontend
- Built for real-world usage

---

## 🔐 Security Notes

- Never expose your `.env`
- Always regenerate tokens if leaked
- Add rate limiting in production
- Use HTTPS in production
- Add auth layer for admin panel

---

## 📌 Future Enhancements

- Web dashboard (React / Next.js)
- Role-based admin system
- Google Maps integration
- Case assignment system
- Analytics & reporting
- Auto classification (AI)
