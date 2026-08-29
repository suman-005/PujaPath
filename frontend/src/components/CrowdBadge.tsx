import { useTranslation } from 'react-i18next'
import type { CrowdLevel } from '../types/puja'
import { cn } from '../utils/cn'

type CrowdBadgeProps = {
  level: CrowdLevel | null
  approximate?: boolean
}

export function CrowdBadge({ level, approximate = true }: CrowdBadgeProps) {
  const { t } = useTranslation()

  if (!level) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-ink-muted)]">
        {t('crowd.label')}: {t('crowd.unknown')}
      </span>
    )
  }

  const label = t(`crowd.${level}`)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        level === 'low' && 'border-[var(--color-crowd-low)] text-[var(--color-crowd-low)]',
        level === 'moderate' && 'border-[var(--color-crowd-moderate)] text-[var(--color-crowd-moderate)]',
        level === 'heavy' && 'border-[var(--color-crowd-heavy)] text-[var(--color-crowd-heavy)]',
      )}
    >
      <span
        className={cn(
          'size-2 rounded-full',
          level === 'low' && 'bg-[var(--color-crowd-low)]',
          level === 'moderate' && 'bg-[var(--color-crowd-moderate)]',
          level === 'heavy' && 'bg-[var(--color-crowd-heavy)]',
        )}
        aria-hidden="true"
      />
      <span>
        {t('crowd.label')}: {label}
        {approximate ? ` · ${t('common.approximateCrowdShort')}` : ''}
      </span>
    </span>
  )
}
