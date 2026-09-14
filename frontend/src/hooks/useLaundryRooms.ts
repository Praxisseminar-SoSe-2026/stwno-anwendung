import { useEffect, useState } from 'react'

import { getLaundryRooms, type LaundryRoom } from '../api/infrastructure'

export function useLaundryRooms() {
  const [laundryRooms, setLaundryRooms] = useState<LaundryRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLaundryRooms()
      .then(setLaundryRooms)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [])
  return { laundryRooms, loading, error }
}
