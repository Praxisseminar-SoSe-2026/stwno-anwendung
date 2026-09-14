import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export function AdminIndexPage() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('adminIndex.title')}</h1>
      <Link to="/admin/tickets">{t('adminTicketOverview.titleShort')}</Link>
    </div>
  )
}
