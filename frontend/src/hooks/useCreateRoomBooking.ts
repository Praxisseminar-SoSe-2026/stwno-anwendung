import { useState } from 'react'
import {
  createRoomBooking,
  type RoomRequestCreate,
  type TicketRequest,
} from '../api/requests'
import { useTranslation } from 'react-i18next'

export function useCreateRoomBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitRoomBooking = async (
    payload: RoomRequestCreate
  ): Promise<TicketRequest | null> => {
    setLoading(true)
    setError(null)

    try {
      return await createRoomBooking(payload)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('roomBooking.createBookingError')
      )
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitRoomBooking, loading, error }
}
