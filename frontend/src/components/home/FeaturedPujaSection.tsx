import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DEMO_PUJAS } from '../../data/demoHome'
import { PujaGrid } from '../PujaGrid'
import { SectionHeader } from '../SectionHeader'

export function FeaturedPujaSection() {
  const { t } = useTranslation()

  return (
    <section className="section-band" aria-labelledby="featured-heading">
      <div className="page-wrap">
        <SectionHeader
          headingId="featured-heading"
          eyebrow={t('brand.name')}
          title={t('home.featured')}
          description={t('home.featuredIntro')}
          action={
            <Link to="/explore" className="btn-outline">
              {t('home.viewAll')}
            </Link>
          }
        />
        <p className="mb-6 text-sm text-[var(--color-ink-muted)]">{t('home.demoNotice')}</p>
        <PujaGrid
          pujas={DEMO_PUJAS}
          loadingLabel={t('common.loading')}
          emptyTitle={t('common.empty')}
          emptyDescription={t('home.featuredEmpty')}
        />
      </div>
    </section>
  )
}
