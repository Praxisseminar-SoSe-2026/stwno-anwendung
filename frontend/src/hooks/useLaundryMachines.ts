import { useEffect, useState, useCallback } from 'react'
import { getLaundryMachines, type LaundryMachine } from '../api/infrastructure'

// return list of laundry machines with their current status
export function useLaundryMachines(laundryRoomId: number | null = null) {
  const [machines, setMachines] = useState<LaundryMachine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useCallback prevents looping when updateLaundryMachines is called [made with tutorial: https://www.youtube.com/watch?v=_AyFP5s69N4]
  const updateLaundryMachines = useCallback(() => {
    if (laundryRoomId == null) {
      setMachines([])
      setLoading(false)
      return
    }
    getLaundryMachines(laundryRoomId)
      .then(setMachines)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [laundryRoomId])

  useEffect(() => {
    updateLaundryMachines()
  }, [updateLaundryMachines])

  return { machines, loading, error, updateLaundryMachines }
}
