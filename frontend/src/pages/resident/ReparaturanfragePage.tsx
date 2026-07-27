import { useTranslation } from 'react-i18next'

export function ReparaturanfragePage() {
  const { t } = useTranslation()

  return <h1>{t('repairRequest.title')}</h1>
}
