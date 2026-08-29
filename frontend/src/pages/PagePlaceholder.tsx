import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type PagePlaceholderProps = {
  titleKey: string
  introKey?: string
}

export function PagePlaceholder({ titleKey, introKey }: PagePlaceholderProps) {
  const { t } = useTranslation()
  const title = t(titleKey)

  useEffect(() => {
    document.title = `${title} | ${t('brand.name')}`
  }, [t, title])

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <p className="font-display text-sm tracking-[0.2em] text-[var(--color-terracotta)] uppercase">
        {t('brand.name')}
      </p>
      <h1 className="font-display mt-2 text-3xl text-[var(--color-ink)] sm:text-4xl">{title}</h1>
      {introKey ? (
        <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">{t(introKey)}</p>
      ) : null}
      <p className="mt-6 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-5 text-sm text-[var(--color-ink-muted)]">
        {t('common.comingSoon')}
      </p>
      <p className="mt-8">
        <Link
          to="/"
          className="text-sm font-medium text-[var(--color-vermillion)] underline-offset-4 hover:underline"
        >
          {t('nav.home')}
        </Link>
      </p>
    </section>
  )
}
