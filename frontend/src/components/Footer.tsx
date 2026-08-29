import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const EXPLORE_LINKS = [
  { to: '/explore', key: 'nav.explore' },
  { to: '/map', key: 'nav.map' },
  { to: '/near-me', key: 'nav.nearMe' },
  { to: '/gallery', key: 'nav.gallery' },
] as const

const HELP_LINKS = [
  { to: '/emergency', key: 'nav.emergency' },
  { to: '/assistant', key: 'nav.assistant' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/about', key: 'nav.about' },
] as const

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto bg-[var(--color-ink)] text-[var(--color-cream)]">
      <div className="alpana" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-lg tracking-[0.16em] text-[var(--color-gold)] uppercase">
            {t('brand.name')}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-cream-muted)]">
            {t('footer.blurb')}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-cream-muted)]">{t('footer.trust')}</p>
        </div>
        <nav aria-label={t('footer.explore')}>
          <p className="text-sm font-semibold tracking-wide text-[var(--color-gold)]">{t('footer.explore')}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {EXPLORE_LINKS.map((item) => (
              <li key={item.to}>
                <Link className="text-sm underline-offset-4 hover:underline" to={item.to}>
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t('footer.help')}>
          <p className="text-sm font-semibold tracking-wide text-[var(--color-gold)]">{t('footer.help')}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {HELP_LINKS.map((item) => (
              <li key={item.to}>
                <Link className="text-sm underline-offset-4 hover:underline" to={item.to}>
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-[var(--color-cream-muted)]">
        {t('footer.rights')}
      </div>
    </footer>
  )
}
