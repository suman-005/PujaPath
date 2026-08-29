import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function DocumentLangSync() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const language = i18n.resolvedLanguage ?? 'en'
    document.documentElement.lang = language
    document.documentElement.dir = 'ltr'
  }, [i18n.resolvedLanguage])

  return null
}
