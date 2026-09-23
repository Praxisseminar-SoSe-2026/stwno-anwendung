import { useEffect, useState, useCallback } from 'react'
import { getLaundryMachines, type LaundryMachine } from '../api/infrastructure'

// return list of laundry machines with their current status
export function useLaundryMachines(laundryRoomId: number | null = null) {
  const [machinesFromAPI, setMachinesFromAPI] = useState<LaundryMachine[]>([])
  const [loading_, setLoading] = useState(true)
  const [error_, setError] = useState<string | null>(null)

  // useCallback prevents looping when updateLaundryMachines is called [made with tutorial: https://www.youtube.com/watch?v=_AyFP5s69N4]
  const updateLaundryMachines = useCallback(() => {
    if (laundryRoomId == null) {
      // Todo: understand what linter does not like about it
      // setMachinesFromAPI([])
      // setLoading(false)
      return
    }
    getLaundryMachines(laundryRoomId)
      .then(setMachinesFromAPI)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [laundryRoomId])

  useEffect(() => {
    updateLaundryMachines()
  }, [updateLaundryMachines])

  // linter problem fix solution, made with the help of AI (Claude)
  const machines = laundryRoomId == null ? [] : machinesFromAPI
  const loading = laundryRoomId == null ? false : loading_
  const error = laundryRoomId == null ? null : error_
  return { machines, loading, error, updateLaundryMachines }
}
