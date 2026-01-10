const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ----------------------------------------
   LOGIN
---------------------------------------- */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username, active: true });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ----------------------------------------
   CREATE ADMIN (SUPER_ADMIN ONLY)
---------------------------------------- */
async function createAdmin(req, res) {
  try {
    const { name, username, password, role } = req.body;

    const exists = await Admin.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new Admin({
      name,
      username,
      password,
      role,
    });

    await admin.save();

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Create admin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

/* ✅ CRITICAL: EXPORT FUNCTIONS EXPLICITLY */
module.exports = {
  login,
  createAdmin,
};
