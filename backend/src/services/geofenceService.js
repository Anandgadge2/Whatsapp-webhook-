const mysql = require("mysql2/promise");

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DB
});

async function loadGeofences() {
	const [rows] = await pool.query(
		"SELECT * FROM site_geofences WHERE deleted_at IS NULL"
	);

	return rows.map((r) => {
		let gf = {
			id: r.id,
			type: r.type,
			lat: r.lat,
			lng: r.lng,
			radius: r.radius,
			name: r.name
		};

		if (r.poly_lat_lng) {
			gf.polygon = JSON.parse(r.poly_lat_lng);
		}

		return gf;
	});
}

module.exports = { loadGeofences };
