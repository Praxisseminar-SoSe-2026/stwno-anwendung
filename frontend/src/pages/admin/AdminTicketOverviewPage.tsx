import { useTranslation } from 'react-i18next'

export function AdminTicketOverviewPage() {
  const { t } = useTranslation()

  return <h1>{t('adminTicketOverview.title')}</h1>
}
