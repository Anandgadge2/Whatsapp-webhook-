const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");

router.get("/stats", admin.getDashboardStats);
router.get("/citizen/:phone", admin.getCitizenProfile);

module.exports = router;
