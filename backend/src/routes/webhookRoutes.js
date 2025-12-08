const express = require("express");
const router = express.Router();
const { verify, receive } = require("../controllers/webhookController");

router.get("/", verify);
router.post("/", receive);

module.exports = router;
