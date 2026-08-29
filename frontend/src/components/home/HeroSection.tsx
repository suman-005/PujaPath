import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { VintagePujaBackground } from '../VintagePujaBackground'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative isolate min-h-[88svh] overflow-hidden" aria-labelledby="hero-heading">
      <VintagePujaBackground />
      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-4xl flex-col justify-center px-4 py-20 text-center sm:py-28">
        <p className="font-display text-sm tracking-[0.32em] text-[var(--color-gold)] uppercase">
          {t('hero.eyebrow')}
        </p>
        <h1
          id="hero-heading"
          className="font-display mt-4 text-5xl tracking-[0.14em] text-[var(--color-cream)] uppercase sm:text-7xl md:text-8xl"
        >
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-lg text-[var(--color-gold)] sm:text-xl">{t('hero.subtitle')}</p>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--color-cream-muted)] sm:text-lg">
          {t('hero.lead')}
        </p>
        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link to="/explore" className="btn-primary">
            {t('hero.explorePuja')}
          </Link>
          <Link to="/map" className="btn-secondary">
            {t('hero.exploreMap')}
          </Link>
        </div>
        <p className="mt-12 text-xs tracking-wide text-[var(--color-cream-muted)]">{t('hero.artworkCredit')}</p>
      </div>
    </section>
  )
}
