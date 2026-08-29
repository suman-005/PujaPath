import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type DocumentMetaOptions = {
  title?: string
  description?: string
}

export function useDocumentMeta({ title, description }: DocumentMetaOptions) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = title ?? t('meta.siteTitle')

    const descriptionTag = document.querySelector('meta[name="description"]')
    if (descriptionTag && description) {
      descriptionTag.setAttribute('content', description)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title ?? t('meta.siteTitle'))

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription && description) {
      ogDescription.setAttribute('content', description)
    }

    document.documentElement.lang = i18n.resolvedLanguage ?? 'en'
  }, [description, i18n.resolvedLanguage, t, title])
}
