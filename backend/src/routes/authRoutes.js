const express = require("express");
const router = express.Router();

const { login, createAdmin } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post("/login", login);

router.post(
  "/create-admin",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  createAdmin
);

module.exports = router;
