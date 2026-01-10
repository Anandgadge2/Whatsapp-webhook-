/**
 * Script to create initial SUPER ADMIN
 * Run using: node src/scripts/createSuperAdmin.js
 */
require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config({ path: __dirname + "/../../.env" });

const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function createSuperAdmin() {
  try {
    // -----------------------------
    // 1. Connect to MongoDB
    // -----------------------------
    await mongoose.connect(process.env.MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });

    console.log("✅ MongoDB Connected");

    // -----------------------------
    // 2. Check if admin exists
    // -----------------------------
    const existingAdmin = await Admin.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Super Admin already exists");
      process.exit(0);
    }

    // -----------------------------
    // 3. Create Super Admin
    // IMPORTANT:
    // - Password must be PLAIN TEXT here
    // - Admin model pre-save hook will hash it
    // -----------------------------
    const admin = await Admin.create({
      name: "System Admin",
      username: "admin",
      password: "admin@123",
      role: "SUPER_ADMIN",
      active: true,
    });

    console.log("✅ Super Admin Created Successfully");
    console.log({
      username: admin.username,
      role: admin.role,
      active: admin.active,
    });

    // -----------------------------
    // 4. Exit cleanly
    // -----------------------------
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createSuperAdmin();
