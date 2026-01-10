const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  });

  console.log("✅ MongoDB Connected");
};

module.exports = connectDB;
