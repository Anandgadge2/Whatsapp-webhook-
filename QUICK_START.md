# 🚀 Quick Start Guide - WhatsApp Webhook

Get your WhatsApp bot up and running in 15 minutes!

---

## Prerequisites

- Node.js 16+ installed
- MongoDB installed or MongoDB Atlas account
- Cloudinary account (free tier)
- Meta Developer account

---

## Step 1: Clone & Install (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

---

## Step 2: Set Up Meta WhatsApp API (5 minutes)

### A. Create Meta App

1. Go to https://developers.facebook.com
2. Click **My Apps** → **Create App** → **Business**
3. Add **WhatsApp** product

### B. Get Credentials

1. **Temporary Token**: Copy from WhatsApp → Getting Started
2. **Phone Number ID**: Copy from same page
3. **Verify Token**: Create any random string (e.g., "my_secret_token_123")

---

## Step 3: Configure Environment (2 minutes)

Create `backend/.env`:

```env
# Server
PORT=3000

# WhatsApp API
GRAPH_API_TOKEN=your_temporary_token_here
PHONE_NUMBER_ID=your_phone_number_id_here
WEBHOOK_VERIFY_TOKEN=my_secret_token_123

# Database (Local MongoDB)
MONGODB_URI=mongodb://127.0.0.1:27017/whatsapp_bot

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Get Cloudinary Credentials:

1. Sign up at https://cloudinary.com
2. Dashboard → Account Details
3. Copy Cloud Name, API Key, API Secret

---

## Step 4: Start MongoDB (1 minute)

### Windows:

```bash
# Start MongoDB service
net start MongoDB
```

### Mac/Linux:

```bash
# Start MongoDB
sudo systemctl start mongod
```

### Or use MongoDB Atlas (Cloud):

1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `MONGODB_URI` in `.env`

---

## Step 5: Start Server (1 minute)

```bash
# Development mode
npm run dev
```

Expected output:

```
✅ MongoDB connected
🚀 Server running on port 3000
```

---

## Step 6: Expose Webhook with Ngrok (2 minutes)

### Install Ngrok:

```bash
# Download from https://ngrok.com/download
# Or install via npm
npm install -g ngrok
```

### Start Ngrok:

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

---

## Step 7: Configure Webhook in Meta (2 minutes)

1. Go to Meta App → WhatsApp → Configuration
2. Click **Edit** in Webhook section
3. **Callback URL**: `https://abc123.ngrok.io/webhook`
4. **Verify Token**: `my_secret_token_123` (same as in .env)
5. Click **Verify and Save**
6. Subscribe to **messages** field

---

## Step 8: Test Your Bot! (1 minute)

1. In Meta App → WhatsApp → Getting Started
2. Add your WhatsApp number to test recipients
3. Send a message from your phone to the test number
4. You should receive an automated response!

---

## 🎉 Success!

Your WhatsApp bot is now running! Check your terminal for incoming messages.

---

## Next Steps

### 1. Test Different Features

Send these messages to your bot:

- **"hi"** - Get welcome message
- **Send an image** - Bot will process and store it
- **Send location** - Bot will capture coordinates

### 2. View Data in MongoDB

```bash
# Connect to MongoDB
mongosh

# Switch to database
use whatsapp_bot

# View all messages
db.complaints.find().pretty()
```

### 3. Monitor Real-time Events

Open `backend/socket-test.html` in browser to see live updates via WebSocket.

### 4. Customize Your Bot

Edit these files:

- `backend/src/controllers/webhookController.js` - Message handling logic
- `backend/src/services/whatsappService.js` - WhatsApp API calls
- `backend/src/models/Complaint.js` - Database schema

---

## Common Issues & Solutions

### Issue 1: "MongoDB connection error"

```bash
# Solution: Start MongoDB service
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl start mongod
```

### Issue 2: "Webhook verification failed"

- Check that `WEBHOOK_VERIFY_TOKEN` in `.env` matches Meta configuration
- Ensure ngrok is running and URL is correct
- Check server logs for errors

### Issue 3: "Message not sending"

- Verify `GRAPH_API_TOKEN` is correct
- Check if token expired (temporary tokens last 24 hours)
- Ensure recipient number is added to test recipients

### Issue 4: "Cannot receive messages"

- Verify webhook is subscribed to "messages" field
- Check ngrok is still running (free tier expires after 2 hours)
- Look for errors in server logs

---

## Production Deployment

Ready to go live? Check these guides:

1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deploy to Heroku, Railway, VPS, etc.
2. **[META_API_GUIDE.md](./META_API_GUIDE.md)** - Get production phone number & permanent token

---

## Useful Commands

```bash
# Development
npm run dev          # Start with auto-reload

# Production
npm start            # Start server

# Database
mongosh              # Connect to MongoDB
npm run seed         # Seed test data (if available)

# Logs
npm run logs         # View application logs
```

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── models/          # Database schemas
│   ├── middlewares/     # Auth, validation, etc.
│   └── app.js           # Express app setup
├── server.js            # Entry point
├── .env                 # Environment variables
└── package.json         # Dependencies
```

---

## Environment Variables Reference

| Variable                | Description                | Example                        |
| ----------------------- | -------------------------- | ------------------------------ |
| `PORT`                  | Server port                | `3000`                         |
| `GRAPH_API_TOKEN`       | WhatsApp API token         | `EAAxxxx...`                   |
| `PHONE_NUMBER_ID`       | WhatsApp phone number ID   | `123456789012345`              |
| `WEBHOOK_VERIFY_TOKEN`  | Webhook verification token | `my_secret_123`                |
| `MONGODB_URI`           | MongoDB connection string  | `mongodb://localhost:27017/db` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name      | `my-cloud`                     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key         | `123456789012345`              |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret      | `abcdef123456`                 |

---

## API Endpoints

### Webhook

- **GET** `/webhook` - Webhook verification
- **POST** `/webhook` - Receive WhatsApp messages

### Health Check

- **GET** `/health` - Server health status

### Admin (if implemented)

- **GET** `/api/complaints` - Get all complaints
- **GET** `/api/complaints/:id` - Get specific complaint
- **PUT** `/api/complaints/:id` - Update complaint status

---

## Testing

### Test Webhook Locally

```bash
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=my_secret_token_123&hub.challenge=test"
```

Expected response: `test`

### Test Message Sending

```javascript
// Create test script: test-send.js
const axios = require("axios");
require("dotenv").config();

async function testSend() {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const response = await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: "919876543210", // Your number
      type: "text",
      text: { body: "Test message from bot!" },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Message sent:", response.data);
}

testSend();
```

Run: `node test-send.js`

---

## Resources

- **Main README**: [README.md](../README.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Meta API Guide**: [META_API_GUIDE.md](./META_API_GUIDE.md)
- **Meta Docs**: https://developers.facebook.com/docs/whatsapp
- **Ngrok Docs**: https://ngrok.com/docs

---

## Support

Having issues? Check:

1. Server logs in terminal
2. Meta App → WhatsApp → Webhooks → Recent Deliveries
3. MongoDB connection status
4. Ngrok tunnel status

---

## What's Next?

- [ ] Add more message types (buttons, lists, images)
- [ ] Implement conversation flows
- [ ] Add admin dashboard
- [ ] Set up automated responses
- [ ] Deploy to production
- [ ] Get production phone number
- [ ] Create message templates
- [ ] Add analytics

---

**Happy Building! 🚀**

Need help? Check the detailed guides or Meta documentation.
