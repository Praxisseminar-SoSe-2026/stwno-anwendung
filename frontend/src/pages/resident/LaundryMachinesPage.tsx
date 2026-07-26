import { useTranslation } from 'react-i18next'

export function LaundryMachinesPage() {
  const { t } = useTranslation()

  return <h1>{t('laundry.title')}</h1>
}
