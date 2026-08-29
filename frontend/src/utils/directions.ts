export function getDirectionsUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    api: '1',
    destination: `${latitude},${longitude}`,
  })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}
