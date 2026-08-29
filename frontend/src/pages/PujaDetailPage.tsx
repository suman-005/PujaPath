import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { DEMO_PUJAS } from '../data/demoHome'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function PujaDetailPage() {
  const { id } = useParams()
  const { t } = useTranslation()
  const puja = DEMO_PUJAS.find((item) => item.id === id)

  useDocumentMeta({
    title: puja ? `${puja.name} | ${t('brand.name')}` : `${t('pages.notFound.title')} | ${t('brand.name')}`,
    description: puja?.shortDescription ?? t('meta.siteDescription'),
  })

  if (!puja) {
    return (
      <section className="page-wrap py-12">
        <EmptyState
          title={t('pages.notFound.title')}
          description={t('pujaCard.notFound')}
          action={
            <Link to="/explore" className="btn-primary">
              {t('nav.explore')}
            </Link>
          }
        />
      </section>
    )
  }

  return (
    <article className="page-wrap py-12">
      <p className="text-xs font-semibold tracking-wide text-[var(--color-terracotta)] uppercase">
        {t('common.demoData')}
      </p>
      <h1 className="font-display mt-2 text-4xl text-[var(--color-ink)]">{puja.name}</h1>
      <p className="mt-3 text-[var(--color-ink-muted)]">{puja.shortDescription}</p>
      <p className="mt-6 text-sm text-[var(--color-ink-muted)]">{t('common.comingSoon')}</p>
      <Link
        to="/"
        className="mt-8 inline-block text-sm text-[var(--color-vermillion)] underline-offset-4 hover:underline"
      >
        {t('nav.home')}
      </Link>
    </article>
  )
}
