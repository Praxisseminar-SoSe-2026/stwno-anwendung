import { useTranslation } from 'react-i18next'

export function FaqPage() {
  const { t } = useTranslation()

  return <h1>{t('faq.title')}</h1>
}
