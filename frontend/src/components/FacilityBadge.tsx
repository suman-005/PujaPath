import { Accessibility, Ambulance, Car, Toilet, UtensilsCrossed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PujaFacilities } from '../types/puja'

const FACILITY_ITEMS = [
  { key: 'parking', icon: Car },
  { key: 'toilet', icon: Toilet },
  { key: 'food', icon: UtensilsCrossed },
  { key: 'medical', icon: Ambulance },
  { key: 'accessibility', icon: Accessibility },
] as const

type FacilityBadgeProps = {
  facilities: PujaFacilities
}

export function FacilityBadgeList({ facilities }: FacilityBadgeProps) {
  const { t } = useTranslation()

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={t('facilities.label')}>
      {FACILITY_ITEMS.map(({ key, icon: Icon }) => {
        const available = facilities[key]
        return (
          <li key={key}>
            <span
              className={
                available
                  ? 'inline-flex items-center gap-1 rounded-full bg-[var(--color-paper)] px-2 py-1 text-[11px] text-[var(--color-ink)]'
                  : 'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-[var(--color-ink-muted)] line-through'
              }
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {t(`facilities.${key}`)}
              <span className="sr-only">
                {available ? t('facilities.available') : t('facilities.unavailable')}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
