import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DEMO_THEMES } from '../../data/demoHome'
import { SectionHeader } from '../SectionHeader'

export function ThemeExploreSection() {
  const { t } = useTranslation()

  return (
    <section className="section-band section-band-paper" aria-labelledby="themes-heading">
      <div className="page-wrap">
        <SectionHeader
          headingId="themes-heading"
          eyebrow={t('home.exploreByTheme')}
          title={t('home.themeTitle')}
          description={t('home.themeIntro')}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_THEMES.map((theme) => (
            <li key={theme.id}>
              <Link
                to={`/explore?theme=${theme.slug}`}
                className="theme-tile block h-full rounded-xl border border-[var(--color-border)] p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
              >
                <p className="text-xs tracking-[0.18em] text-[var(--color-gold)] uppercase">
                  {t('common.demoData')}
                </p>
                <h3 className="font-display mt-3 text-2xl text-[var(--color-cream)]">{t(theme.nameKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-cream-muted)]">
                  {t(theme.descriptionKey)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
