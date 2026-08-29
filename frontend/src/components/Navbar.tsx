import { Menu, Search, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { cn } from '../utils/cn'
import { LanguageSwitcher } from './LanguageSwitcher'

const NAV_ITEMS = [
  { to: '/', key: 'nav.home' },
  { to: '/explore', key: 'nav.explore' },
  { to: '/map', key: 'nav.map' },
  { to: '/near-me', key: 'nav.nearMe' },
  { to: '/routes', key: 'nav.routes' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/emergency', key: 'nav.emergency' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/assistant', key: 'nav.assistant' },
] as const

export function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const menuId = useId()

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-cream)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-ink)] focus:px-3 focus:py-2 focus:text-[var(--color-cream)]"
      >
        {t('nav.skipToContent')}
      </a>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          className="min-w-0 shrink-0"
          aria-label={t('brand.name')}
          onClick={() => setMenuOpen(false)}
        >
          <span className="font-display text-xl tracking-[0.18em] text-[var(--color-vermillion)] uppercase">
            {t('brand.name')}
          </span>
          <span className="mt-0.5 block text-[10px] tracking-wide text-[var(--color-ink-muted)] sm:text-xs">
            {t('brand.tagline')}
          </span>
        </Link>

        <form
          className="hidden min-w-0 flex-1 items-center gap-2 md:flex"
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            const value = query.trim()
            if (value) navigate(`/explore?q=${encodeURIComponent(value)}`)
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            {t('nav.search')}
          </label>
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-ink-muted)]"
              aria-hidden="true"
            />
            <input
              id="site-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] py-2 pr-4 pl-10 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
            />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-ink)] hover:bg-[var(--color-paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}</span>
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-[var(--color-border)] lg:block" aria-label={t('brand.name')}>
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]',
                    isActive
                      ? 'bg-[var(--color-ink)] text-[var(--color-cream)]'
                      : 'text-[var(--color-ink-muted)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]',
                  )
                }
                end={item.to === '/'}
              >
                {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="alpana" aria-hidden="true" />

      {menuOpen ? (
        <div
          id={menuId}
          className="border-t border-[var(--color-border)] bg-[var(--color-cream)] px-4 py-4 lg:hidden"
        >
          <form
            className="mb-4"
            role="search"
            onSubmit={(event) => {
              event.preventDefault()
              const value = query.trim()
              if (value) navigate(`/explore?q=${encodeURIComponent(value)}`)
              setMenuOpen(false)
            }}
          >
            <label htmlFor="site-search-mobile" className="sr-only">
              {t('nav.search')}
            </label>
            <input
              id="site-search-mobile"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-2.5 text-base text-[var(--color-ink)]"
            />
          </form>
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-3 text-base',
                      isActive
                        ? 'bg-[var(--color-ink)] text-[var(--color-cream)]'
                        : 'text-[var(--color-ink)] hover:bg-[var(--color-paper)]',
                    )
                  }
                  end={item.to === '/'}
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-[var(--color-border)] pt-4">
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </header>
  )
}
