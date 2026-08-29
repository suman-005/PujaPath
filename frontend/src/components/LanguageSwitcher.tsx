import { useTranslation } from 'react-i18next'
import type { AppLanguage } from '../i18n'
import { SUPPORTED_LANGUAGES } from '../i18n'
import { cn } from '../utils/cn'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = (i18n.resolvedLanguage ?? 'en') as AppLanguage

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('nav.language')}>
      {SUPPORTED_LANGUAGES.map((code) => {
        const selected = current === code
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={selected}
            onClick={() => {
              void i18n.changeLanguage(code)
            }}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium tracking-wide transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]',
              selected
                ? 'bg-[var(--color-terracotta)] text-[var(--color-cream)]'
                : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]',
            )}
          >
            {t(`languages.${code}`)}
          </button>
        )
      })}
    </div>
  )
}
