function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

function haversine(lat1, lng1, lat2, lng2) {
	const R = 6371000;
	const dLat = deg2rad(lat2 - lat1);
	const dLng = deg2rad(lng2 - lng1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLng / 2) * Math.sin(dLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
}

function pointInPolygon(point, polygon) {
	let inside = false;
	let x = point.lng,
		y = point.lat;

	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		let xi = polygon[i].lng,
			yi = polygon[i].lat;
		let xj = polygon[j].lng,
			yj = polygon[j].lat;

		let intersect =
			yi > y !== yj > y &&
			x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-12) + xi;

		if (intersect) inside = !inside;
	}
	return inside;
}

module.exports = { haversine, pointInPolygon };
