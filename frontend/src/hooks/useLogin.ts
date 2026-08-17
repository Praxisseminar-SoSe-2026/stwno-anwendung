import { useState } from 'react'
import { login, type LoginData, type LoginResponse } from '../api/login'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

export function useLogin() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()
  const { setUser } = useAuth()

  const submitLogin = async (
    data: LoginData
  ): Promise<LoginResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await login(data)
      localStorage.setItem('access_token', result.access_token)
      setUser({
        id: result.id,
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
        roles: result.roles,
        dormitory_id: result.dormitory_id,
      })
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : t('login.error'))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitLogin, loading, error }
}
