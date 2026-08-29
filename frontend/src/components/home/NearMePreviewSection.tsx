import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DEMO_PUJAS } from '../../data/demoHome'
import { EmptyState } from '../EmptyState'
import { PujaGrid } from '../PujaGrid'
import { SectionHeader } from '../SectionHeader'

export function NearMePreviewSection() {
  const { t } = useTranslation()
  const nearby = [...DEMO_PUJAS].sort((a, b) => (a.demoDistanceKm ?? 99) - (b.demoDistanceKm ?? 99))

  return (
    <section className="section-band" aria-labelledby="near-me-heading">
      <div className="page-wrap">
        <SectionHeader
          headingId="near-me-heading"
          eyebrow={t('nav.nearMe')}
          title={t('home.nearMe')}
          description={t('home.nearMeIntro')}
          action={
            <Link to="/near-me" className="btn-outline">
              {t('home.openNearMe')}
            </Link>
          }
        />
        <p className="mb-6 text-sm text-[var(--color-ink-muted)]">{t('home.nearMeDemoNote')}</p>
        {nearby.length === 0 ? (
          <EmptyState
            title={t('common.locationDenied')}
            description={t('home.nearMeFallback')}
            action={
              <Link to="/explore" className="btn-primary">
                {t('nav.explore')}
              </Link>
            }
          />
        ) : (
          <PujaGrid
            pujas={nearby}
            showDistance
            loadingLabel={t('common.loading')}
            emptyTitle={t('common.empty')}
          />
        )}
      </div>
    </section>
  )
}
