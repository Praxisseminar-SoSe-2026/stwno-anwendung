import { useState } from 'react'
import {
  createLaundryBooking,
  type CreateLaundryBookingPayload,
  type LaundryBooking,
} from '../api/laundry'
import { useTranslation } from 'react-i18next'

export function useCreateLaundryBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitLaundryBooking = async (
    payload: CreateLaundryBookingPayload
  ): Promise<LaundryBooking | null> => {
    setLoading(true)
    setError(null)

    try {
      return await createLaundryBooking(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('repairRequest.error'))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitLaundryBooking, loading, error }
}
