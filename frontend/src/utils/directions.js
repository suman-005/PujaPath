/**
 * Safely generates an external map directions URL from validated numeric coordinates.
 * Prevents script injection and malformed parameters.
 */
export function getDirectionsUrl(latitude, longitude) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  // Bounds validation: lat [-90, 90], lng [-180, 180]
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(lat)},${encodeURIComponent(lng)}`;
}