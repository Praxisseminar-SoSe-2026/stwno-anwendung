import { useEffect, useState } from 'react'
import { getLaundryMachines, type LaundryMachine } from '../api/infrastructure'

// return list of laundry machines with their current status
export function useLaundryMachines(laundryRoomId: number) {
  const [machines, setMachines] = useState<LaundryMachine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLaundryMachines(laundryRoomId)
      .then(setMachines)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [laundryRoomId])

  return { machines, loading, error }
}
