# 🚀 Production Deployment Checklist

Use this checklist to ensure your WhatsApp webhook is production-ready.

---

## 📋 Pre-Deployment Checklist

### Meta WhatsApp Business API Setup

- [ ] **Meta Business Account created and verified**

  - Business name matches legal entity
  - Business details are accurate
  - Email verified

- [ ] **Meta App created with WhatsApp product**

  - App name is descriptive
  - App is in "Live" mode (not Development)
  - WhatsApp product added

- [ ] **Production phone number added**

  - Business phone number verified
  - Number is not a test number
  - Display name configured
  - Business profile completed (logo, description, address)

- [ ] **Permanent access token generated**

  - System user created
  - Appropriate permissions granted
  - Token saved securely (password manager, secrets vault)
  - Token tested and working

- [ ] **Message templates created and approved**

  - All required templates submitted
  - Templates approved by Meta
  - Template names documented
  - Template parameters tested

- [ ] **Business verification completed**
  - Business documents submitted
  - Verification status: Approved
  - Quality rating: Green
  - Messaging tier: Appropriate for volume

---

## 🔧 Application Configuration

### Environment Variables

- [ ] **All environment variables configured**

  - `GRAPH_API_TOKEN` - Permanent token (not temporary)
  - `PHONE_NUMBER_ID` - Production phone number ID
  - `WEBHOOK_VERIFY_TOKEN` - Strong, random string
  - `MONGODB_URI` - Production database connection
  - `CLOUDINARY_*` - Production credentials
  - `NODE_ENV=production`

- [ ] **Secrets management**
  - No hardcoded secrets in code
  - `.env` file in `.gitignore`
  - Secrets stored in hosting platform's environment variables
  - Backup of secrets in secure location

### Database

- [ ] **MongoDB production setup**

  - Using MongoDB Atlas or managed service
  - Appropriate cluster size for expected load
  - IP whitelist configured (or 0.0.0.0/0 with strong auth)
  - Database user created with minimal permissions
  - Connection pooling configured
  - Indexes created for frequently queried fields

- [ ] **Database backups configured**
  - Automated daily backups enabled
  - Backup retention policy set (e.g., 30 days)
  - Backup restoration tested
  - Point-in-time recovery enabled (if available)

### Media Storage

- [ ] **Cloudinary production setup**
  - Production account (not free tier if high volume)
  - Upload presets configured
  - Folder structure organized
  - Auto-moderation enabled (if needed)
  - Backup/sync strategy in place

---

## 🔒 Security

### Application Security

- [ ] **Security headers configured**

  - Helmet.js installed and configured
  - CORS properly configured
  - CSP headers set (if serving frontend)

- [ ] **Rate limiting implemented**

  - Express-rate-limit configured
  - Appropriate limits for webhook endpoint
  - Different limits for different endpoints
  - Rate limit exceeded responses handled gracefully

- [ ] **Input validation**

  - All user inputs validated
  - Webhook payload validation
  - Phone number format validation
  - File upload size limits

- [ ] **Authentication & Authorization**

  - Admin endpoints protected
  - JWT or session-based auth implemented
  - Role-based access control (if needed)
  - Password hashing (bcrypt)

- [ ] **HTTPS/SSL**
  - SSL certificate installed
  - HTTPS enforced (HTTP redirects to HTTPS)
  - Certificate auto-renewal configured
  - Strong SSL configuration (A+ rating on SSL Labs)

### Data Protection

- [ ] **GDPR/Privacy compliance**

  - Privacy policy created
  - User consent mechanism implemented
  - Data retention policy defined
  - User data deletion mechanism
  - Data encryption at rest (if required)

- [ ] **Logging & Monitoring**
  - No sensitive data in logs (tokens, passwords)
  - Log rotation configured
  - Centralized logging (optional but recommended)

---

## 🚀 Deployment

### Hosting Platform

- [ ] **Platform selected and configured**

  - [ ] Heroku
  - [ ] Railway
  - [ ] Render
  - [ ] VPS (DigitalOcean, AWS, etc.)
  - [ ] Docker/Kubernetes

- [ ] **Server configuration**
  - Appropriate instance size for expected load
  - Auto-scaling configured (if available)
  - Region selected (closest to users)
  - Custom domain configured (if applicable)

### Application Deployment

- [ ] **Code deployed**

  - Latest stable version deployed
  - Dependencies installed (`npm install --production`)
  - Build process completed (if applicable)
  - Environment variables set on platform

- [ ] **Process management**
  - PM2 or equivalent configured (for VPS)
  - Auto-restart on crash enabled
  - Graceful shutdown handling
  - Zero-downtime deployment strategy

### Webhook Configuration

- [ ] **Webhook URL configured in Meta**

  - Production URL set (https://yourdomain.com/webhook)
  - Webhook verified successfully
  - Subscribed to required fields:
    - [x] messages
    - [ ] message_status (optional)
    - [ ] messaging_postbacks (if using buttons)

- [ ] **Webhook tested**
  - Test message sent and received
  - Response sent successfully
  - Webhook logs show no errors
  - Retry mechanism tested (if implemented)

---

## 📊 Monitoring & Observability

### Application Monitoring

- [ ] **Health checks configured**

  - `/health` endpoint implemented
  - Uptime monitoring service configured (UptimeRobot, Pingdom)
  - Alerts set up for downtime
  - Response time monitoring

- [ ] **Error tracking**

  - Sentry or similar service integrated
  - Error notifications configured
  - Error grouping and prioritization
  - Source maps uploaded (if applicable)

- [ ] **Logging**

  - Winston or similar logger configured
  - Log levels appropriate (info, warn, error)
  - Logs accessible and searchable
  - Log retention policy set

- [ ] **Performance monitoring**
  - Response time tracking
  - Database query performance monitoring
  - Memory usage monitoring
  - CPU usage monitoring

### Business Metrics

- [ ] **Analytics configured**

  - Message volume tracking
  - User engagement metrics
  - Conversation completion rates
  - Error rates by type

- [ ] **WhatsApp-specific metrics**
  - Quality rating monitored
  - Messaging tier status
  - Template approval status
  - Conversation costs tracked

---

## 🧪 Testing

### Functional Testing

- [ ] **End-to-end testing**

  - Send message → Receive response
  - Button interactions work
  - List selections work
  - Image upload and processing
  - Location sharing
  - Template messages send correctly

- [ ] **Error scenarios tested**
  - Invalid phone number
  - Unsupported message type
  - Media download failure
  - Database connection failure
  - API rate limit exceeded

### Load Testing

- [ ] **Performance testing**
  - Tested with expected message volume
  - Concurrent user handling verified
  - Database performance under load
  - Memory leaks checked
  - Response time acceptable under load

---

## 📝 Documentation

- [ ] **Technical documentation**

  - API endpoints documented
  - Environment variables documented
  - Deployment process documented
  - Troubleshooting guide created

- [ ] **User documentation**

  - User guide for interacting with bot
  - FAQ created
  - Support contact information provided

- [ ] **Operational documentation**
  - Runbook for common issues
  - Escalation procedures
  - Backup and recovery procedures
  - Incident response plan

---

## 🔄 Post-Deployment

### Immediate (Day 1)

- [ ] **Verify production deployment**

  - Send test messages from multiple numbers
  - Check all features working
  - Monitor error rates
  - Check database connections

- [ ] **Monitor closely**
  - Watch logs for errors
  - Monitor response times
  - Check quality rating
  - Verify webhook deliveries

### Week 1

- [ ] **Performance review**

  - Analyze response times
  - Review error logs
  - Check resource usage (CPU, memory, database)
  - Optimize if needed

- [ ] **User feedback**
  - Collect user feedback
  - Identify common issues
  - Plan improvements

### Ongoing

- [ ] **Regular maintenance**

  - Update dependencies monthly
  - Review and rotate secrets quarterly
  - Check for security updates
  - Monitor Meta API changes

- [ ] **Capacity planning**
  - Monitor growth trends
  - Plan for scaling
  - Review messaging tier limits
  - Optimize costs

---

## 🆘 Rollback Plan

- [ ] **Rollback strategy defined**

  - Previous version tagged in git
  - Rollback procedure documented
  - Database migration rollback plan
  - Estimated rollback time known

- [ ] **Rollback tested**
  - Rollback procedure tested in staging
  - Team trained on rollback process
  - Rollback triggers defined

---

## 📞 Support & Escalation

- [ ] **Support contacts documented**

  - Meta support contact
  - Hosting platform support
  - Database provider support
  - Team on-call schedule

- [ ] **Escalation procedures**
  - Severity levels defined
  - Escalation paths documented
  - Response time SLAs defined

---

## ✅ Final Sign-off

- [ ] **Technical lead approval**
- [ ] **Security review completed**
- [ ] **Load testing passed**
- [ ] **Documentation complete**
- [ ] **Monitoring configured**
- [ ] **Rollback plan tested**
- [ ] **Team trained**

**Deployment Date**: **\*\***\_\_\_**\*\***

**Deployed By**: **\*\***\_\_\_**\*\***

**Approved By**: **\*\***\_\_\_**\*\***

---

## 🎉 Go Live!

Once all items are checked:

1. **Announce go-live** to stakeholders
2. **Monitor closely** for first 24 hours
3. **Be ready** to rollback if critical issues
4. **Collect feedback** from users
5. **Iterate and improve**

---

## 📚 Additional Resources

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Meta API Guide](./META_API_GUIDE.md)
- [Quick Start Guide](./QUICK_START.md)
- [Meta WhatsApp Docs](https://developers.facebook.com/docs/whatsapp)

---

**Remember**: Production is not a one-time event, it's an ongoing process. Keep monitoring, improving, and scaling!
