const Grievance = require("../models/Grievance");
const Appointment = require("../models/Appointment");

exports.getDashboardStats = async (req, res) => {
  const [grievances, appointments] = await Promise.all([
    Grievance.find(),
    Appointment.find(),
  ]);

  res.json({
    totalGrievances: grievances.length,
    pendingGrievances: grievances.filter((g) => g.status === "PENDING").length,
    resolvedGrievances: grievances.filter((g) => g.status === "RESOLVED")
      .length,

    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === "PENDING")
      .length,
    confirmedAppointments: appointments.filter((a) => a.status === "CONFIRMED")
      .length,
  });
};

exports.getCitizenProfile = async (req, res) => {
  const { phone } = req.params;

  const grievances = await Grievance.find({ phone });
  const appointments = await Appointment.find({ phone });

  res.json({
    phone,
    grievances,
    appointments,
  });
};
