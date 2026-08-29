import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  tone?: 'light' | 'dark'
  headingId?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  tone = 'light',
  headingId,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p
            className={cn(
              'font-display text-sm tracking-[0.22em] uppercase',
              tone === 'dark' ? 'text-[var(--color-gold)]' : 'text-[var(--color-terracotta)]',
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={headingId}
          className={cn(
            'font-display mt-2 text-3xl leading-tight sm:text-4xl',
            tone === 'dark' ? 'text-[var(--color-cream)]' : 'text-[var(--color-ink)]',
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              'mt-3 max-w-xl text-base leading-relaxed',
              tone === 'dark' ? 'text-[var(--color-cream-muted)]' : 'text-[var(--color-ink-muted)]',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
