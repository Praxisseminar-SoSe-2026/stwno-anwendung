import { setPassword, type SetPasswordData } from '../api/setPassword.ts'
import { useState } from 'react'

export function useSetPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submitSetPassword = async (data: SetPasswordData): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await setPassword(data)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setting password failed')
      return false
    } finally {
      setLoading(false)
    }
  }
  return { submitSetPassword, loading, error }
}
