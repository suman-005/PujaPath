import { ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { DEMO_EMERGENCY_CATEGORIES } from '../../data/demoHome'
import { SectionHeader } from '../SectionHeader'

export function EmergencyPreviewSection() {
  const { t } = useTranslation()

  return (
    <section className="section-band section-band-ink" aria-labelledby="emergency-heading">
      <div className="page-wrap">
        <SectionHeader
          headingId="emergency-heading"
          tone="dark"
          eyebrow={t('nav.emergency')}
          title={t('home.emergency')}
          description={t('home.emergencyIntro')}
          action={
            <Link to="/emergency" className="btn-secondary">
              {t('home.openEmergency')}
            </Link>
          }
        />
        <p className="mb-6 flex items-start gap-2 text-sm text-[var(--color-cream-muted)]">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-[var(--color-gold)]" aria-hidden="true" />
          {t('common.emergencyDisclaimer')}
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_EMERGENCY_CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                to={category.href}
                className="block rounded-xl border border-white/15 bg-[var(--color-night)] px-4 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
              >
                <h3 className="text-lg font-semibold text-[var(--color-cream)]">{t(category.nameKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-cream-muted)]">
                  {t(category.descriptionKey)}
                </p>
                <p className="mt-3 text-sm text-[var(--color-gold)]">{t('home.noInventedNumbers')}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
