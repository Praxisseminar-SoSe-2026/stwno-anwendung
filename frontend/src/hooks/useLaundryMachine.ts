import { useEffect, useState } from 'react'
import {
  getLaundryMachineById,
  type LaundryMachine,
} from '../api/infrastructure.ts'

export function useLaundryMachine(laundryMachineId: number | null) {
  const [machine, setMachine] = useState<LaundryMachine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (laundryMachineId === null) {
      // Todo: understand what linter does not like about it
      // setLoading(false)
      return
    }
    getLaundryMachineById(laundryMachineId)
      .then(setMachine)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [laundryMachineId])

  return { machine, loading, error }
}
