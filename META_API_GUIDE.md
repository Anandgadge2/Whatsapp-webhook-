# 📱 Meta WhatsApp Business API - Complete Guide

This guide covers everything you need to know about setting up and using the Meta WhatsApp Business API for real-life production use cases.

---

## 📋 Table of Contents

1. [Getting Started with Meta Business](#getting-started-with-meta-business)
2. [WhatsApp Business API Setup](#whatsapp-business-api-setup)
3. [Understanding the API](#understanding-the-api)
4. [Real-Life Use Cases](#real-life-use-cases)
5. [Advanced Features](#advanced-features)
6. [Best Practices](#best-practices)
7. [Pricing & Limits](#pricing--limits)

---

## Getting Started with Meta Business

### Step 1: Create Meta Business Account

1. Go to [Meta Business Suite](https://business.facebook.com)
2. Click **Create Account**
3. Fill in your business details:
   - Business name
   - Your name
   - Business email
4. Verify your email

### Step 2: Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Click **My Apps** → **Create App**
3. Select **Business** as app type
4. Fill in app details:
   - **App Name**: "WhatsApp Bot" (or your choice)
   - **App Contact Email**: Your email
   - **Business Account**: Select your business account
5. Click **Create App**

### Step 3: Add WhatsApp Product

1. In your app dashboard, find **WhatsApp** in the products list
2. Click **Set Up**
3. Select your **Business Portfolio**
4. Click **Continue**

---

## WhatsApp Business API Setup

### Step 1: Get Test Phone Number

Meta provides a **test phone number** for development:

1. Go to **WhatsApp** → **Getting Started**
2. You'll see a test phone number (e.g., +1 555-0100)
3. Add your personal WhatsApp number to receive test messages
4. Click **Send Message** to test

⚠️ **Note**: Test number has limitations:

- Only works with 5 pre-registered numbers
- Messages expire after 72 hours
- Not for production use

### Step 2: Get Production Phone Number

For real-life use, you need a **verified business phone number**:

#### Option A: Use Existing Number

1. Go to **WhatsApp** → **API Setup**
2. Click **Add Phone Number**
3. Enter your business phone number
4. Verify via SMS/Call
5. Complete business verification

#### Option B: Get New Number

1. Purchase a new number from:
   - Twilio
   - Vonage
   - Your local telecom provider
2. Add it to WhatsApp Business API
3. Verify ownership

### Step 3: Get Access Tokens

#### Temporary Access Token (Development)

1. Go to **WhatsApp** → **Getting Started**
2. Copy the **Temporary Access Token**
3. Valid for 24 hours only

#### Permanent Access Token (Production)

1. Go to **WhatsApp** → **Configuration**
2. Click **System Users** (in Business Settings)
3. Create a new system user:
   - Name: "WhatsApp Bot User"
   - Role: Admin
4. Click **Generate New Token**
5. Select permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
6. Copy and save the token securely

### Step 4: Get Phone Number ID

1. Go to **WhatsApp** → **Getting Started**
2. Find **Phone Number ID** (looks like: `123456789012345`)
3. Copy this ID - you'll need it for API calls

### Step 5: Configure Webhook

1. Go to **WhatsApp** → **Configuration**
2. Click **Edit** in Webhook section
3. Enter your webhook URL:
   ```
   https://your-domain.com/webhook
   ```
4. Enter **Verify Token** (any secure random string)
5. Click **Verify and Save**
6. Subscribe to webhook fields:
   - ✅ messages
   - ✅ message_status (optional, for delivery receipts)

---

## Understanding the API

### API Endpoints

#### 1. Send Messages

```
POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages
```

#### 2. Get Media

```
GET https://graph.facebook.com/v18.0/{MEDIA_ID}
```

#### 3. Download Media

```
GET https://graph.facebook.com/v18.0/{MEDIA_URL}
```

### Message Types

#### 1. Text Message

```javascript
const axios = require("axios");

async function sendTextMessage(to, message) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: message,
    },
  };

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

// Usage
sendTextMessage("919876543210", "Hello from WhatsApp API!");
```

#### 2. Interactive Buttons

```javascript
async function sendButtonMessage(to, bodyText, buttons) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: bodyText,
      },
      action: {
        buttons: buttons.map((btn, index) => ({
          type: "reply",
          reply: {
            id: `btn_${index}`,
            title: btn,
          },
        })),
      },
    },
  };

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

// Usage
sendButtonMessage("919876543210", "How can we help you today?", [
  "Support",
  "Sales",
  "Billing",
]);
```

#### 3. List Messages

```javascript
async function sendListMessage(to, bodyText, sections) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "Menu",
      },
      body: {
        text: bodyText,
      },
      footer: {
        text: "Select an option",
      },
      action: {
        button: "View Options",
        sections: sections,
      },
    },
  };

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

// Usage
sendListMessage("919876543210", "Choose a service:", [
  {
    title: "Services",
    rows: [
      {
        id: "service_1",
        title: "Consultation",
        description: "Book a consultation",
      },
      {
        id: "service_2",
        title: "Support",
        description: "Get technical support",
      },
      {
        id: "service_3",
        title: "Feedback",
        description: "Share your feedback",
      },
    ],
  },
]);
```

#### 4. Image Message

```javascript
async function sendImageMessage(to, imageUrl, caption) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "image",
    image: {
      link: imageUrl,
      caption: caption,
    },
  };

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

// Usage
sendImageMessage(
  "919876543210",
  "https://example.com/image.jpg",
  "Check out our new product!"
);
```

#### 5. Template Message (Pre-approved)

```javascript
async function sendTemplateMessage(to, templateName, languageCode, parameters) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const data = {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: [
        {
          type: "body",
          parameters: parameters.map((param) => ({
            type: "text",
            text: param,
          })),
        },
      ],
    },
  };

  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

// Usage
sendTemplateMessage("919876543210", "order_confirmation", "en_US", [
  "John",
  "ORD12345",
  "$99.99",
]);
```

### Receiving Messages (Webhook)

Your webhook receives messages in this format:

```javascript
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15550100",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "contacts": [
              {
                "profile": {
                  "name": "John Doe"
                },
                "wa_id": "919876543210"
              }
            ],
            "messages": [
              {
                "from": "919876543210",
                "id": "wamid.XXX",
                "timestamp": "1234567890",
                "type": "text",
                "text": {
                  "body": "Hello"
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

---

## Real-Life Use Cases

### Use Case 1: Customer Support Bot

**Scenario**: Automated customer support with ticket creation

```javascript
// backend/src/services/supportBotService.js
const whatsappService = require("./whatsappService");
const Ticket = require("../models/Ticket");

async function handleSupportRequest(from, message) {
  // Create ticket
  const ticket = await Ticket.create({
    phone: from,
    message: message,
    status: "open",
    createdAt: new Date(),
  });

  // Send confirmation
  await whatsappService.sendMessage(
    from,
    `✅ Ticket #${ticket._id} created!\n\nOur team will respond within 24 hours.\n\nYour issue: ${message}`
  );

  // Notify support team
  await notifySupportTeam(ticket);
}

module.exports = { handleSupportRequest };
```

### Use Case 2: Appointment Booking

**Scenario**: Book appointments via WhatsApp

```javascript
// backend/src/services/appointmentService.js
const whatsappService = require("./whatsappService");
const Appointment = require("../models/Appointment");

async function startBookingFlow(from) {
  // Send date selection
  await whatsappService.sendInteractiveButtons(
    from,
    "📅 Select a date for your appointment:",
    [
      { id: "today", title: "Today" },
      { id: "tomorrow", title: "Tomorrow" },
      { id: "custom", title: "Choose Date" },
    ]
  );
}

async function handleDateSelection(from, selectedDate) {
  // Send time slots
  const availableSlots = await getAvailableSlots(selectedDate);

  await whatsappService.sendListMessage(from, "⏰ Select a time slot:", [
    {
      title: "Available Slots",
      rows: availableSlots.map((slot) => ({
        id: slot.id,
        title: slot.time,
        description: `${slot.duration} minutes`,
      })),
    },
  ]);
}

async function confirmAppointment(from, date, time) {
  const appointment = await Appointment.create({
    phone: from,
    date: date,
    time: time,
    status: "confirmed",
  });

  await whatsappService.sendMessage(
    from,
    `✅ Appointment Confirmed!\n\n📅 Date: ${date}\n⏰ Time: ${time}\n\nWe'll send you a reminder 1 hour before.`
  );

  // Schedule reminder
  scheduleReminder(appointment);
}

module.exports = { startBookingFlow, handleDateSelection, confirmAppointment };
```

### Use Case 3: Order Tracking

**Scenario**: Track orders in real-time

```javascript
// backend/src/services/orderTrackingService.js
const whatsappService = require("./whatsappService");
const Order = require("../models/Order");

async function trackOrder(from, orderId) {
  const order = await Order.findOne({ orderId: orderId });

  if (!order) {
    await whatsappService.sendMessage(
      from,
      "❌ Order not found. Please check your order ID."
    );
    return;
  }

  const statusEmoji = {
    pending: "⏳",
    processing: "🔄",
    shipped: "🚚",
    delivered: "✅",
  };

  const message = `
${statusEmoji[order.status]} Order Status: ${order.status.toUpperCase()}

📦 Order ID: ${order.orderId}
📅 Order Date: ${order.createdAt.toLocaleDateString()}
💰 Total: $${order.total}

${order.trackingUrl ? `🔗 Track: ${order.trackingUrl}` : ""}

Estimated Delivery: ${order.estimatedDelivery}
  `.trim();

  await whatsappService.sendMessage(from, message);
}

async function sendOrderUpdate(orderId, newStatus) {
  const order = await Order.findOne({ orderId: orderId });

  await whatsappService.sendMessage(
    order.phone,
    `📦 Order Update!\n\nYour order #${orderId} is now: ${newStatus}\n\nTrack: ${order.trackingUrl}`
  );
}

module.exports = { trackOrder, sendOrderUpdate };
```

### Use Case 4: Lead Generation

**Scenario**: Capture leads and qualify them

```javascript
// backend/src/services/leadGenerationService.js
const whatsappService = require("./whatsappService");
const Lead = require("../models/Lead");

const conversationState = new Map();

async function startLeadCapture(from) {
  conversationState.set(from, { step: "name" });

  await whatsappService.sendMessage(
    from,
    "👋 Welcome! I'm here to help.\n\nWhat's your name?"
  );
}

async function handleLeadResponse(from, message) {
  const state = conversationState.get(from) || { step: "name" };

  switch (state.step) {
    case "name":
      state.name = message;
      state.step = "email";
      await whatsappService.sendMessage(from, "Great! What's your email?");
      break;

    case "email":
      state.email = message;
      state.step = "company";
      await whatsappService.sendMessage(from, "And your company name?");
      break;

    case "company":
      state.company = message;
      state.step = "interest";
      await whatsappService.sendInteractiveButtons(
        from,
        "What are you interested in?",
        ["Product Demo", "Pricing", "Partnership"]
      );
      break;

    case "interest":
      state.interest = message;

      // Save lead
      await Lead.create({
        phone: from,
        name: state.name,
        email: state.email,
        company: state.company,
        interest: state.interest,
        source: "whatsapp",
      });

      await whatsappService.sendMessage(
        from,
        `✅ Thanks ${state.name}!\n\nOur team will contact you within 24 hours.`
      );

      conversationState.delete(from);
      break;
  }

  conversationState.set(from, state);
}

module.exports = { startLeadCapture, handleLeadResponse };
```

### Use Case 5: E-commerce Catalog

**Scenario**: Browse and purchase products

```javascript
// backend/src/services/catalogService.js
const whatsappService = require("./whatsappService");
const Product = require("../models/Product");

async function showCatalog(from, category) {
  const products = await Product.find({ category: category }).limit(10);

  const sections = [
    {
      title: category,
      rows: products.map((product) => ({
        id: product._id.toString(),
        title: product.name,
        description: `$${product.price} - ${product.description.substring(
          0,
          50
        )}`,
      })),
    },
  ];

  await whatsappService.sendListMessage(
    from,
    `🛍️ ${category} Products`,
    sections
  );
}

async function showProductDetails(from, productId) {
  const product = await Product.findById(productId);

  await whatsappService.sendImageMessage(
    from,
    product.imageUrl,
    `${product.name}\n\n💰 Price: $${product.price}\n\n${product.description}`
  );

  await whatsappService.sendInteractiveButtons(
    from,
    "What would you like to do?",
    ["Add to Cart", "View Similar", "Back to Catalog"]
  );
}

async function addToCart(from, productId) {
  // Add to cart logic
  const cart = await getOrCreateCart(from);
  await cart.addItem(productId);

  await whatsappService.sendMessage(
    from,
    `✅ Added to cart!\n\nTotal items: ${cart.items.length}\nTotal: $${cart.total}\n\nType 'checkout' to complete your order.`
  );
}

module.exports = { showCatalog, showProductDetails, addToCart };
```

### Use Case 6: Feedback Collection

**Scenario**: Collect customer feedback with ratings

```javascript
// backend/src/services/feedbackService.js
const whatsappService = require("./whatsappService");
const Feedback = require("../models/Feedback");

async function requestFeedback(from, orderId) {
  await whatsappService.sendMessage(
    from,
    `Hi! How was your experience with order #${orderId}?\n\nRate us from 1-5 (5 being excellent)`
  );
}

async function handleRating(from, rating, orderId) {
  if (rating >= 4) {
    await whatsappService.sendMessage(
      from,
      "⭐ Thank you for the great rating!\n\nWould you like to leave a review?"
    );
  } else {
    await whatsappService.sendMessage(
      from,
      "We're sorry to hear that. 😔\n\nCould you tell us what went wrong?"
    );
  }

  await Feedback.create({
    phone: from,
    orderId: orderId,
    rating: rating,
    timestamp: new Date(),
  });
}

module.exports = { requestFeedback, handleRating };
```

---

## Advanced Features

### 1. Message Templates

Templates must be pre-approved by Meta. Create them in **WhatsApp Manager**:

1. Go to [WhatsApp Manager](https://business.facebook.com/wa/manage/message-templates/)
2. Click **Create Template**
3. Fill in details:
   - **Name**: `order_confirmation`
   - **Category**: Transactional
   - **Language**: English
   - **Content**:

     ```
     Hello {{1}},

     Your order {{2}} has been confirmed!

     Total: {{3}}

     Thank you for your purchase!
     ```
4. Submit for approval (usually takes 24-48 hours)

### 2. Media Handling

#### Upload Media to Meta

```javascript
async function uploadMedia(filePath, mimeType) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("messaging_product", "whatsapp");
  form.append("type", mimeType);

  const response = await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/media`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
    }
  );

  return response.data.id; // Media ID
}
```

#### Download Media from User

```javascript
async function downloadUserMedia(mediaId) {
  // Step 1: Get media URL
  const mediaInfo = await axios.get(
    `https://graph.facebook.com/v18.0/${mediaId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
      },
    }
  );

  // Step 2: Download media
  const mediaResponse = await axios.get(mediaInfo.data.url, {
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
    },
    responseType: "arraybuffer",
  });

  return mediaResponse.data;
}
```

### 3. Read Receipts

Mark messages as read:

```javascript
async function markAsRead(messageId) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}
```

### 4. Conversation Analytics

Track conversation metrics:

```javascript
async function getConversationAnalytics(startDate, endDate) {
  const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/conversation_analytics`;

  const response = await axios.get(url, {
    params: {
      start: startDate,
      end: endDate,
      granularity: "daily",
      metric_types: "conversation,cost",
    },
    headers: {
      Authorization: `Bearer ${process.env.GRAPH_API_TOKEN}`,
    },
  });

  return response.data;
}
```

---

## Best Practices

### 1. Message Timing

- ✅ **DO**: Respond within 24 hours
- ✅ **DO**: Send messages during business hours (9 AM - 9 PM)
- ❌ **DON'T**: Send promotional messages without opt-in
- ❌ **DON'T**: Spam users with frequent messages

### 2. Conversation Windows

- **24-hour window**: Free to send any message after user initiates
- **After 24 hours**: Must use pre-approved templates (charged)
- **Best practice**: Keep conversations active within 24 hours

### 3. Message Quality

- ✅ Use clear, concise language
- ✅ Personalize messages with user's name
- ✅ Provide value in every message
- ✅ Use emojis appropriately 😊
- ❌ Avoid all caps (LOOKS LIKE SHOUTING)
- ❌ Don't send long paragraphs

### 4. Error Handling

```javascript
async function sendMessageWithRetry(to, message, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await whatsappService.sendMessage(to, message);
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limit - wait and retry
        await sleep(2000 * (i + 1));
        continue;
      }
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### 5. User Privacy

- ✅ Get explicit consent before messaging
- ✅ Provide opt-out mechanism
- ✅ Store data securely
- ✅ Comply with GDPR/local regulations
- ❌ Don't share user data with third parties

### 6. Rate Limits

- **Messaging**: 80 messages/second per phone number
- **Media**: 100 requests/second
- **Best practice**: Implement queue system for bulk messages

---

## Pricing & Limits

### Message Pricing (as of 2024)

#### Conversation-Based Pricing

- **User-Initiated**: Free for first 1,000/month
- **Business-Initiated**: Varies by country

**India Pricing Example**:

- Marketing: ₹0.40 per conversation
- Utility: ₹0.25 per conversation
- Authentication: ₹0.15 per conversation
- Service: ₹0.20 per conversation

### Free Tier

- 1,000 user-initiated conversations/month
- Test phone number with 5 recipients
- All API features included

### Rate Limits

- **Tier 1** (Default): 1,000 unique users/24 hours
- **Tier 2**: 10,000 unique users/24 hours
- **Tier 3**: 100,000 unique users/24 hours
- **Tier 4**: Unlimited (requires approval)

**Upgrade Tiers**: Automatic based on message quality and volume

### Quality Rating

Maintain high quality to avoid restrictions:

- **Green**: Good quality
- **Yellow**: Medium quality (warning)
- **Red**: Low quality (restrictions applied)

**Factors**:

- User blocks
- User reports
- Message delivery failures

---

## Troubleshooting

### Common Errors

#### 1. Error 131031: User's number is not a WhatsApp number

```
Solution: Verify the number is registered on WhatsApp
```

#### 2. Error 131026: Message undeliverable

```
Solution: User may have blocked your number or doesn't have WhatsApp
```

#### 3. Error 100: Invalid parameter

```
Solution: Check your message format and required fields
```

#### 4. Error 190: Access token expired

```
Solution: Generate a new permanent access token
```

#### 5. Error 80007: Rate limit exceeded

```
Solution: Implement rate limiting and retry logic
```

### Debug Mode

Enable webhook debugging:

```javascript
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", JSON.stringify(req.body, null, 2));
  // Your webhook logic
});
```

---

## Resources

### Official Documentation

- [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Reference](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)

### Tools

- [WhatsApp Manager](https://business.facebook.com/wa/manage/)
- [Meta Business Suite](https://business.facebook.com)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)

### Community

- [Meta Developer Community](https://developers.facebook.com/community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/whatsapp-business-api)

---

## Quick Start Checklist

- [ ] Meta Business Account created
- [ ] Meta App created with WhatsApp product
- [ ] Phone number added and verified
- [ ] Permanent access token generated
- [ ] Phone Number ID obtained
- [ ] Webhook configured and verified
- [ ] Test message sent successfully
- [ ] Message templates created (if needed)
- [ ] Business verification completed (for production)
- [ ] Billing information added

---

**Next Steps**: Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deploying your application to production.
