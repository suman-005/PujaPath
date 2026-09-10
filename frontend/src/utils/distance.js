/**
 * Computes great-circle distance between two points in kilometers using the Haversine formula.
 * Strict coordinate validation ensures robustness against NaN, Infinity, and out-of-range coordinates.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const pLat1 = parseFloat(lat1);
  const pLon1 = parseFloat(lon1);
  const pLat2 = parseFloat(lat2);
  const pLon2 = parseFloat(lon2);

  if (
    Number.isNaN(pLat1) || Number.isNaN(pLon1) ||
    Number.isNaN(pLat2) || Number.isNaN(pLon2) ||
    !Number.isFinite(pLat1) || !Number.isFinite(pLon1) ||
    !Number.isFinite(pLat2) || !Number.isFinite(pLon2)
  ) {
    return null;
  }

  // Coordinate boundary checks
  if (pLat1 < -90 || pLat1 > 90 || pLat2 < -90 || pLat2 > 90) return null;
  if (pLon1 < -180 || pLon1 > 180 || pLon2 < -180 || pLon2 > 180) return null;

  if (pLat1 === pLat2 && pLon1 === pLon2) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in km
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(pLat2 - pLat1);
  const dLon = toRad(pLon2 - pLon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pLat1)) * Math.cos(toRad(pLat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}