const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Get all complaints
router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update complaint status
router.put("/complaints/:id", async (req, res) => {
  try {
    const { status, officerName } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, officerName },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
});

module.exports = router;
