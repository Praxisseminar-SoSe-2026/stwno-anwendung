import { useEffect, useState } from 'react'
import { getUsers, type UserList } from '../api/users.ts'

export function useUsers() {
  const [users, setUsers] = useState<UserList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load')
      )
      .finally(() => setLoading(false))
  }, [])
  return { users, loading, error }
}
