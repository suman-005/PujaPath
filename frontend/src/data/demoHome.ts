import type { CrowdLevel, PujaSummary } from '../types/puja'

export type DemoTheme = {
  id: string
  slug: string
  nameKey: string
  descriptionKey: string
}

export type DemoEmergencyCategory = {
  id: string
  nameKey: string
  descriptionKey: string
  href: string
}

export type DemoPuja = PujaSummary & {
  themeKey: string
  demoDistanceKm: number | null
}

const demoFacilities = {
  parking: true,
  toilet: true,
  food: true,
  medical: false,
  accessibility: true,
} as const

export const DEMO_PUJAS: DemoPuja[] = [
  {
    id: 'demo-bardhaman-heritage',
    name: 'DEMO: Bardhaman Heritage Sarbojanin',
    slug: 'demo-bardhaman-heritage',
    area: 'DEMO AREA — Bardhaman Town',
    address: 'Sample address only. Not a verified pandal location.',
    themeName: 'Heritage',
    themeKey: 'themes.heritage',
    shortDescription: 'Sample listing used to design the directory. This is not a verified Puja.',
    crowdLevel: 'moderate' satisfies CrowdLevel,
    facilities: { ...demoFacilities, medical: true },
    coordinates: { latitude: 23.232, longitude: 87.861 },
    coverImageUrl: null,
    isDemo: true,
    verified: false,
    lastVerifiedAt: null,
    demoDistanceKm: 1.2,
  },
  {
    id: 'demo-kalna-folk',
    name: 'DEMO: Kalna Folk Theme Puja',
    slug: 'demo-kalna-folk',
    area: 'DEMO AREA — Kalna',
    address: 'Sample address only. Not a verified pandal location.',
    themeName: 'Folk',
    themeKey: 'themes.folk',
    shortDescription: 'Sample folk-theme card for layout and translation testing.',
    crowdLevel: 'low' satisfies CrowdLevel,
    facilities: { ...demoFacilities, parking: false },
    coordinates: { latitude: 23.219, longitude: 88.363 },
    coverImageUrl: null,
    isDemo: true,
    verified: false,
    lastVerifiedAt: null,
    demoDistanceKm: 3.4,
  },
  {
    id: 'demo-katwa-contemporary',
    name: 'DEMO: Katwa Contemporary Pandal',
    slug: 'demo-katwa-contemporary',
    area: 'DEMO AREA — Katwa',
    address: 'Sample address only. Not a verified pandal location.',
    themeName: 'Contemporary',
    themeKey: 'themes.contemporary',
    shortDescription: 'Placeholder contemporary-theme listing. Replace with verified records later.',
    crowdLevel: 'heavy' satisfies CrowdLevel,
    facilities: { ...demoFacilities, accessibility: false, food: true },
    coordinates: { latitude: 23.643, longitude: 88.129 },
    coverImageUrl: null,
    isDemo: true,
    verified: false,
    lastVerifiedAt: null,
    demoDistanceKm: 6.1,
  },
]

export const DEMO_THEMES: DemoTheme[] = [
  { id: 'heritage', slug: 'heritage', nameKey: 'themes.heritage', descriptionKey: 'themes.heritageDesc' },
  { id: 'folk', slug: 'folk', nameKey: 'themes.folk', descriptionKey: 'themes.folkDesc' },
  { id: 'traditional', slug: 'traditional', nameKey: 'themes.traditional', descriptionKey: 'themes.traditionalDesc' },
  { id: 'contemporary', slug: 'contemporary', nameKey: 'themes.contemporary', descriptionKey: 'themes.contemporaryDesc' },
]

export const DEMO_EMERGENCY_CATEGORIES: DemoEmergencyCategory[] = [
  { id: 'medical', nameKey: 'homeEmergency.medical', descriptionKey: 'homeEmergency.medicalDesc', href: '/emergency' },
  { id: 'police', nameKey: 'homeEmergency.police', descriptionKey: 'homeEmergency.policeDesc', href: '/emergency' },
  { id: 'fire', nameKey: 'homeEmergency.fire', descriptionKey: 'homeEmergency.fireDesc', href: '/emergency' },
  { id: 'women', nameKey: 'homeEmergency.women', descriptionKey: 'homeEmergency.womenDesc', href: '/emergency' },
  { id: 'child', nameKey: 'homeEmergency.child', descriptionKey: 'homeEmergency.childDesc', href: '/emergency' },
]

export const ASSISTANT_PROMPTS = [
  'homeAssistant.q1',
  'homeAssistant.q2',
  'homeAssistant.q3',
] as const
