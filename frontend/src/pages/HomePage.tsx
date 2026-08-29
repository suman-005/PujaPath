import { useTranslation } from 'react-i18next'
import { AboutPreviewSection } from '../components/home/AboutPreviewSection'
import { AssistantPreviewSection } from '../components/home/AssistantPreviewSection'
import { EmergencyPreviewSection } from '../components/home/EmergencyPreviewSection'
import { FeaturedPujaSection } from '../components/home/FeaturedPujaSection'
import { HeroSection } from '../components/home/HeroSection'
import { NearMePreviewSection } from '../components/home/NearMePreviewSection'
import { ThemeExploreSection } from '../components/home/ThemeExploreSection'
import { JsonLdWebsite } from '../components/JsonLdWebsite'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function HomePage() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: t('meta.siteTitle'),
    description: t('meta.siteDescription'),
  })

  return (
    <>
      <JsonLdWebsite />
      <HeroSection />
      <FeaturedPujaSection />
      <ThemeExploreSection />
      <NearMePreviewSection />
      <EmergencyPreviewSection />
      <AssistantPreviewSection />
      <AboutPreviewSection />
    </>
  )
}
