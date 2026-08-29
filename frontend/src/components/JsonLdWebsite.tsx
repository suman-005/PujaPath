import { useTranslation } from 'react-i18next'

export function JsonLdWebsite() {
  const { t } = useTranslation()
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t('brand.name'),
    alternateName: 'Purba Bardhaman Durga Puja Guide',
    description: t('meta.siteDescription'),
    url: import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173',
    inLanguage: ['en', 'bn', 'hi'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  )
}
