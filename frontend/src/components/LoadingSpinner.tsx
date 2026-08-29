import { cn } from '../utils/cn'

type LoadingSpinnerProps = {
  label: string
  className?: string
}

export function LoadingSpinner({ label, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-12', className)} role="status">
      <span
        className="size-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-terracotta)]"
        aria-hidden="true"
      />
      <span className="text-sm text-[var(--color-ink-muted)]">{label}</span>
    </div>
  )
}
