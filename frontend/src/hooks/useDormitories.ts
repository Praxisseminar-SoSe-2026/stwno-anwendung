import { useEffect, useState } from 'react'
import { getDormitories, type Dormitory } from '../api/dormitories'

export function useDormitories() {
  const [dormitories, setDormitories] = useState<Dormitory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDormitories()
      .then(setDormitories)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [])

  return { dormitories, loading, error }
}