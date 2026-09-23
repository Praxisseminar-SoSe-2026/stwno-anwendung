import { useEffect, useState } from 'react'
import {
  getLaundryMachineById,
  type LaundryMachine,
} from '../api/infrastructure.ts'

export function useLaundryMachine(laundryMachineId: number) {
  const [laundryMachine, setLaundryMachine] = useState<LaundryMachine | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getLaundryMachineById(laundryMachineId)
      .then(setLaundryMachine)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [laundryMachineId])

  return { laundryMachine, loading, error }
}
