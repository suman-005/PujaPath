# PujaPath: Authentic Data Source & Verification Policy

## 1. Zero-Fabrication Rule
PujaPath is a public safety, accessibility, and navigation system. Under no circumstances may any contributor, administrator, or automated process invent or estimate:
- Puja pandal locations, coordinates, or addresses.
- Contact numbers or committee leadership details.
- Emergency services contact numbers.
- Timings, facilities, or crowd states.
- Photographs (AI renders or unverified stock photos must never be represented as real).

## 2. Acceptable Data Sources
Every verified record must be supported by verifiable documentation:
- **Primary Sources (Gold Standard)**:
  - Direct submission or verification by the registered Puja Committee / Organizers.
  - Official district administration circulars, police notices, or municipal publications (Purba Bardhaman District Administration / Bardhaman Municipality).
  - Official emergency telephone directories published by Government of West Bengal departments.
- **Secondary Sources (Require Corroboration)**:
  - Reputable registered news organizations covering local Puja pandals.
  - Where secondary sources are used, at least two independent corroborating sources are required before marking `verified=true`.

## 3. Geographic Boundary & Coordinate Verification
- Coordinates must be captured at the actual pandal entry or queuing gate.
- Coordinates must lie strictly within Purba Bardhaman district boundaries:
  - Latitude: 22.8000° N to 23.8000° N
  - Longitude: 87.3000° E to 88.5000° E
- Never use centroid approximations of towns or districts.

## 4. Photograph Verification & Licensing
- Real photographs must be tagged `is_real_photo = true`.
- Artwork, theme concept posters, or 3D architectural renders must be tagged `is_real_photo = false`.
- Only photographs provided directly by the organizers, captured by authorized contributors, or licensed under Creative Commons / public domain with full attribution may be used.
- Web-scraped images from third parties without licensing are strictly prohibited.

## 5. Emergency Contact Verification
- Emergency numbers must never be entered from unverified directories.
- Prior to marking `verified = true`, the telephone line must be verified against official department directories.
- The `last_verified_at` timestamp must reflect the actual verification date.
