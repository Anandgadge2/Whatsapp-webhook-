# 🚀 WhatsApp Webhook Deployment Guide

This guide covers deploying your WhatsApp webhook application to production environments.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Production Best Practices](#production-best-practices)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ A Meta Business Account
- ✅ WhatsApp Business API access
- ✅ A domain name (for production)
- ✅ SSL certificate (HTTPS required by Meta)
- ✅ MongoDB database (cloud-hosted recommended)
- ✅ Cloudinary account for media storage

---

## Environment Setup

### 1. Create Production Environment Variables

Create a `.env` file in the `backend` folder with the following:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# WhatsApp Cloud API (Meta)
GRAPH_API_TOKEN=your_permanent_access_token
PHONE_NUMBER_ID=your_phone_number_id
WEBHOOK_VERIFY_TOKEN=your_secure_random_string
BUSINESS_ACCOUNT_ID=your_business_account_id

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security (Optional but Recommended)
JWT_SECRET=your_jwt_secret_for_admin_auth
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### 2. Secure Your Tokens

⚠️ **CRITICAL**: Never commit `.env` to version control!

```bash
# Verify .gitignore includes:
.env
.env.local
.env.production
```

---

## Deployment Options

### Option 1: Heroku (Easiest)

#### Step 1: Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

#### Step 2: Create Heroku App

```bash
cd backend
heroku create your-whatsapp-webhook
```

#### Step 3: Set Environment Variables

```bash
heroku config:set GRAPH_API_TOKEN=your_token
heroku config:set PHONE_NUMBER_ID=your_phone_id
heroku config:set WEBHOOK_VERIFY_TOKEN=your_verify_token
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
```

#### Step 4: Deploy

```bash
git init
git add .
git commit -m "Initial deployment"
git push heroku main
```

#### Step 5: Configure Webhook URL

Your webhook URL will be:

```
https://your-whatsapp-webhook.herokuapp.com/webhook
```

---

### Option 2: Railway (Modern & Fast)

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

#### Step 2: Initialize Project

```bash
cd backend
railway init
```

#### Step 3: Add Environment Variables

Go to Railway dashboard → Your Project → Variables → Add all your `.env` variables

#### Step 4: Deploy

```bash
railway up
```

#### Step 5: Get Your URL

```bash
railway domain
```

Your webhook URL: `https://your-project.railway.app/webhook`

---

### Option 3: Render (Free Tier Available)

#### Step 1: Create Account

- Go to [render.com](https://render.com)
- Sign up with GitHub

#### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: whatsapp-webhook
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

#### Step 3: Add Environment Variables

In Render dashboard, add all variables from your `.env` file

#### Step 4: Deploy

Render will auto-deploy on every push to your repository

Your webhook URL: `https://whatsapp-webhook.onrender.com/webhook`

---

### Option 4: VPS (DigitalOcean, AWS EC2, etc.)

#### Step 1: Set Up Server

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx (Reverse Proxy)
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

#### Step 2: Clone Repository

```bash
cd /var/www
git clone https://github.com/yourusername/whatsapp-webhook.git
cd whatsapp-webhook/backend
npm install
```

#### Step 3: Create .env File

```bash
nano .env
# Paste your environment variables
# Save with Ctrl+X, Y, Enter
```

#### Step 4: Configure PM2

```bash
# Start application
pm2 start server.js --name whatsapp-webhook

# Save PM2 configuration
pm2 save

# Enable PM2 on system startup
pm2 startup
```

#### Step 5: Configure Nginx

```bash
nano /etc/nginx/sites-available/whatsapp-webhook
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/whatsapp-webhook /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 6: Enable SSL

```bash
certbot --nginx -d your-domain.com
```

Your webhook URL: `https://your-domain.com/webhook`

---

### Option 5: Docker Deployment

#### Step 1: Create Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml

Create `backend/docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

#### Step 3: Deploy

```bash
cd backend
docker-compose up -d
```

---

## Production Best Practices

### 1. Security Enhancements

#### Add Rate Limiting

```bash
npm install express-rate-limit
```

Create `backend/src/middlewares/rateLimiter.js`:

```javascript
const rateLimit = require("express-rate-limit");

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
});

module.exports = { webhookLimiter };
```

#### Add Helmet for Security Headers

```bash
npm install helmet
```

Update `backend/src/app.js`:

```javascript
const helmet = require("helmet");
app.use(helmet());
```

### 2. Logging

#### Install Winston

```bash
npm install winston
```

Create `backend/src/utils/logger.js`:

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
```

### 3. Health Check Endpoint

Add to `backend/src/app.js`:

```javascript
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

### 4. Database Connection Pooling

Update MongoDB connection in `backend/src/config/db.js`:

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## Monitoring & Maintenance

### 1. Application Monitoring

#### Option A: PM2 Monitoring (VPS)

```bash
pm2 monit
pm2 logs whatsapp-webhook
```

#### Option B: New Relic (All Platforms)

```bash
npm install newrelic
```

#### Option C: Sentry (Error Tracking)

```bash
npm install @sentry/node
```

### 2. Database Backups

#### MongoDB Atlas (Automated)

- Enable automatic backups in Atlas dashboard
- Schedule: Daily at 2 AM

#### Manual Backup

```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/database_name" --out=/backup/$(date +%Y%m%d)
```

### 3. Log Rotation

Create `/etc/logrotate.d/whatsapp-webhook`:

```
/var/www/whatsapp-webhook/backend/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 4. Uptime Monitoring

Use services like:

- **UptimeRobot** (free): https://uptimerobot.com
- **Pingdom**: https://pingdom.com
- **StatusCake**: https://statuscake.com

Monitor your `/health` endpoint every 5 minutes.

---

## Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Messages

```bash
# Check if server is running
curl https://your-domain.com/health

# Check webhook verification
curl "https://your-domain.com/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
```

#### 2. MongoDB Connection Timeout

- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Test connection: `mongosh "mongodb+srv://..."`

#### 3. Cloudinary Upload Fails

- Verify API credentials
- Check file size limits
- Test with: `curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload`

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Cloudinary integration working
- [ ] SSL certificate installed
- [ ] Webhook URL configured in Meta
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Health check endpoint working
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented
- [ ] Error tracking enabled
- [ ] Documentation updated

---

## Next Steps

After deployment:

1. Test webhook with real WhatsApp messages
2. Monitor logs for errors
3. Set up alerts for downtime
4. Document your deployment process
5. Create a rollback plan

---

**Need Help?** Check the [META_API_GUIDE.md](./META_API_GUIDE.md) for WhatsApp API configuration.
