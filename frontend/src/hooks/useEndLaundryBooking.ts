import { useState } from 'react'
import { endLaundryBooking, type LaundryBooking } from '../api/laundry'

export function useEndLaundryBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitEndLaundryBooking = async (
    id: number | null
  ): Promise<LaundryBooking | null> => {
    if (id === null) {
      return null
    }

    setLoading(true)
    setError(null)

    try {
      return await endLaundryBooking(id)
    } catch (err) {
      // Todo: adapt error messages in hooks
      setError(err instanceof Error ? err.message : 'Failed to load')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitEndLaundryBooking, loading, error }
}
