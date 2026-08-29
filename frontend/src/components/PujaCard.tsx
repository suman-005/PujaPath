import { MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { DemoPuja } from '../data/demoHome'
import { getDirectionsUrl } from '../utils/directions'
import { CrowdBadge } from './CrowdBadge'
import { FacilityBadgeList } from './FacilityBadge'

type PujaCardProps = {
  puja: DemoPuja
  showDistance?: boolean
}

export function PujaCard({ puja, showDistance = false }: PujaCardProps) {
  const { t } = useTranslation()
  const detailsHref = `/puja/${puja.id}`
  const directionsHref = getDirectionsUrl(puja.coordinates.latitude, puja.coordinates.longitude)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] shadow-[0_10px_24px_rgba(28,20,16,0.08)]">
      <div className="card-portrait relative aspect-[4/3]">
        {puja.coverImageUrl ? (
          <img
            src={puja.coverImageUrl}
            alt={t('pujaCard.realPhotoAlt', { name: puja.name })}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
            <p className="font-display text-2xl tracking-[0.18em] text-[var(--color-gold)] uppercase">
              {t('brand.name')}
            </p>
            <p className="mt-2 max-w-[14rem] text-xs leading-relaxed text-[var(--color-cream-muted)]">
              {t('pujaCard.placeholderVisual')}
            </p>
          </div>
        )}
        {puja.isDemo ? (
          <span className="absolute top-3 left-3 rounded-full bg-[var(--color-ink)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[var(--color-gold)] uppercase">
            {t('common.demoData')}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-xl text-[var(--color-ink)]">{puja.name}</h3>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-[var(--color-ink-muted)]">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{puja.area}</span>
          </p>
        </div>
        <p className="text-sm font-medium text-[var(--color-terracotta)]">{t(puja.themeKey)}</p>
        <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">{puja.shortDescription}</p>
        <CrowdBadge level={puja.crowdLevel} />
        {showDistance && puja.demoDistanceKm !== null ? (
          <p className="text-sm text-[var(--color-ink)]">
            {t('common.distanceKm', { km: puja.demoDistanceKm })}{' '}
            <span className="text-[var(--color-ink-muted)]">({t('common.demoDistance')})</span>
          </p>
        ) : null}
        <FacilityBadgeList facilities={puja.facilities} />
        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
          <Link to={detailsHref} className="btn-primary flex-1 text-center">
            {t('common.viewDetails')}
          </Link>
          <a
            href={directionsHref}
            target="_blank"
            rel="noreferrer"
            className="btn-outline flex-1 text-center"
          >
            {t('common.getDirections')}
          </a>
        </div>
      </div>
    </article>
  )
}
