import type { ReactNode } from 'react'
import type { DemoPuja } from '../data/demoHome'
import { EmptyState } from './EmptyState'
import { LoadingSpinner } from './LoadingSpinner'
import { PujaCard } from './PujaCard'

type PujaGridProps = {
  pujas: DemoPuja[]
  status?: 'loading' | 'ready' | 'empty' | 'error'
  loadingLabel: string
  emptyTitle: string
  emptyDescription?: string
  errorMessage?: string
  onRetry?: () => void
  retryLabel?: string
  showDistance?: boolean
  emptyAction?: ReactNode
}

export function PujaGrid({
  pujas,
  status = 'ready',
  loadingLabel,
  emptyTitle,
  emptyDescription,
  errorMessage,
  onRetry,
  retryLabel,
  showDistance = false,
  emptyAction,
}: PujaGridProps) {
  if (status === 'loading') {
    return <LoadingSpinner label={loadingLabel} />
  }

  if (status === 'error') {
    return (
      <EmptyState
        title={errorMessage ?? emptyTitle}
        action={
          onRetry ? (
            <button type="button" className="btn-primary" onClick={onRetry}>
              {retryLabel}
            </button>
          ) : null
        }
      />
    )
  }

  if (status === 'empty' || pujas.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {pujas.map((puja) => (
        <li key={puja.id}>
          <PujaCard puja={puja} showDistance={showDistance} />
        </li>
      ))}
    </ul>
  )
}
