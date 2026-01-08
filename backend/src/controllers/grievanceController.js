const grievanceService = require("../services/grievanceService");

/**
 * Create a new grievance
 */
exports.createGrievance = async (req, res) => {
  try {
    const { userName, phone, category, description, location, imageUrl } =
      req.body;

    const grievance = await grievanceService.createGrievance({
      userName,
      phone,
      category,
      description,
      location,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Grievance created successfully",
      data: grievance,
    });
  } catch (error) {
    console.error("Error creating grievance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create grievance",
    });
  }
};

/**
 * Get grievance status by ID
 */
exports.getGrievanceStatus = async (req, res) => {
  try {
    const { grievanceId } = req.params;

    const grievance = await grievanceService.getGrievanceStatus(grievanceId);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    res.json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    console.error("Error fetching grievance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch grievance",
    });
  }
};

/**
 * Get all grievances by phone
 */
exports.getGrievancesByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const grievances = await grievanceService.getGrievancesByPhone(phone);

    res.json({
      success: true,
      data: grievances,
    });
  } catch (error) {
    console.error("Error fetching grievances:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch grievances",
    });
  }
};

/**
 * Update grievance status (Admin)
 */
exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const { status, remarks } = req.body;

    const grievance = await grievanceService.updateGrievanceStatus(
      grievanceId,
      status,
      remarks
    );

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    res.json({
      success: true,
      message: "Grievance updated successfully",
      data: grievance,
    });
  } catch (error) {
    console.error("Error updating grievance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update grievance",
    });
  }
};

/**
 * Get all grievances (Admin)
 */
exports.getAllGrievances = async (req, res) => {
  try {
    const Grievance = require("../models/Grievance");
    const grievances = await Grievance.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: grievances,
    });
  } catch (error) {
    console.error("Error fetching all grievances:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch grievances",
    });
  }
};
