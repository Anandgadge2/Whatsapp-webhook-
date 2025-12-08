// seed_mongo_officers.js
require("dotenv").config();
const mongoose = require("mongoose");
const Officer = require("./src/models/Officer");

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const officers = [
    {
      name: "Officer A",
      whatsappNumber: "919876543210",
      sites: [7720, 7202]
    },
    {
      name: "Officer B",
      whatsappNumber: "919812345678",
      sites: [6628]
    }
  ];

  await Officer.insertMany(officers);

  console.log("Seed complete");
  process.exit();
}

main();
