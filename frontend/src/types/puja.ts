export const CROWD_LEVELS = ['low', 'moderate', 'heavy'] as const
export type CrowdLevel = (typeof CROWD_LEVELS)[number]

export const USER_ROLES = ['USER', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const IMAGE_TYPES = [
  'pandal',
  'idol',
  'lighting',
  'entrance',
  'theme',
  'night',
  'day',
] as const
export type ImageType = (typeof IMAGE_TYPES)[number]

export type Verification = {
  verified: boolean
  lastVerifiedAt: string | null
}

export type PujaFacilities = {
  parking: boolean
  toilet: boolean
  food: boolean
  medical: boolean
  accessibility: boolean
}

export type Coordinates = {
  latitude: number
  longitude: number
}

export type Theme = {
  id: string
  name: string
  slug: string
}

export type PujaImage = {
  id: string
  pujaId: string
  url: string
  alt: string
  caption: string
  imageType: ImageType
  isDecorativeArtwork: boolean
}

export type PujaSummary = {
  id: string
  name: string
  slug: string
  area: string
  address: string
  themeName: string
  shortDescription: string
  crowdLevel: CrowdLevel | null
  facilities: PujaFacilities
  coordinates: Coordinates
  coverImageUrl: string | null
  isDemo: boolean
} & Verification
