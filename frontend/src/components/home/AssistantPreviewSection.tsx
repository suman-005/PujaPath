import { MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ASSISTANT_PROMPTS } from '../../data/demoHome'
import { SectionHeader } from '../SectionHeader'

export function AssistantPreviewSection() {
  const { t } = useTranslation()

  return (
    <section className="section-band" aria-labelledby="assistant-heading">
      <div className="page-wrap grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeader
            headingId="assistant-heading"
            eyebrow={t('nav.assistant')}
            title={t('home.assistant')}
            description={t('home.assistantIntro')}
          />
          <ul className="space-y-3">
            {ASSISTANT_PROMPTS.map((key) => (
              <li key={key}>
                <Link
                  to="/assistant"
                  className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-4 py-3 text-sm text-[var(--color-ink)] hover:border-[var(--color-terracotta)]"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/assistant" className="btn-primary mt-6">
            {t('home.openAssistant')}
          </Link>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-night)] p-6 text-[var(--color-cream)]">
          <p className="flex items-center gap-2 font-display text-2xl text-[var(--color-gold)]">
            <MessageCircle className="size-6" aria-hidden="true" />
            {t('home.assistant')}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-cream-muted)]">
            {t('home.assistantTrust')}
          </p>
        </div>
      </div>
    </section>
  )
}
