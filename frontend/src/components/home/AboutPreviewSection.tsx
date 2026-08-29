import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SectionHeader } from '../SectionHeader'

export function AboutPreviewSection() {
  const { t } = useTranslation()

  return (
    <section className="section-band section-band-paper" aria-labelledby="about-heading">
      <div className="page-wrap max-w-3xl">
        <SectionHeader
          headingId="about-heading"
          eyebrow={t('nav.about')}
          title={t('home.about')}
          description={t('home.aboutIntro')}
        />
        <p className="text-base leading-relaxed text-[var(--color-ink-muted)]">{t('home.aboutBody')}</p>
        <Link to="/about" className="btn-outline mt-8">
          {t('home.readAbout')}
        </Link>
      </div>
    </section>
  )
}
