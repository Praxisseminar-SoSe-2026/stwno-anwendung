import { useEffect, useState } from 'react'
import { getRoomBookings, type RoomBooking } from '../api/requests'

export function useRoomBookings() {
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getRoomBookings()
      .then(setRoomBookings)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [])
  return { roomBookings, loading, error }
}
