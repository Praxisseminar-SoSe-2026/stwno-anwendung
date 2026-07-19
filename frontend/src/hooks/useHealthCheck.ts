import { useEffect, useState } from 'react'
import { checkHealth } from '../api/checkHealth'

// return 'online' or 'offline' depending on availability of API
export function useHealthCheck() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>(
    'loading'
  )

  useEffect(() => {
    checkHealth().then((ok) => setStatus(ok ? 'online' : 'offline'))
  }, [])

  return status
}
