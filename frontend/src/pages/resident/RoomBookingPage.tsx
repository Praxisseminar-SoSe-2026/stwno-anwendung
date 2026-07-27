import { useTranslation } from 'react-i18next'

export function RoomBookingPage() {
  const { t } = useTranslation()

  return <h1>{t('roomBooking.title')}</h1>
}
