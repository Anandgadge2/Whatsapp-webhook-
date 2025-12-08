// seed_mysql_geofences.js
require("dotenv").config();
const mysql = require("mysql2/promise");

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
  });

  const [rows] = await pool.query("SELECT * FROM site_geofences WHERE deleted_at IS NULL");

  console.log("Geofences Loaded:", rows.length);
  console.log(JSON.stringify(rows, null, 2));

  process.exit();
}

main();
