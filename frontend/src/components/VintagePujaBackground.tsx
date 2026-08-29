import { useTranslation } from 'react-i18next'
import heroArtwork from '../assets/hero-vintage-durga-puja.png'

export function VintagePujaBackground() {
  const { t } = useTranslation()

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="hero-artwork absolute inset-0"
        style={{ backgroundImage: `url(${heroArtwork})` }}
        role="img"
        aria-label={t('hero.artworkAlt')}
      />
      <div className="hero-overlay absolute inset-0" aria-hidden="true" />
    </div>
  )
}
