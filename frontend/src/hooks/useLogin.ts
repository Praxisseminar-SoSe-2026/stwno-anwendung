import { useState } from 'react'
import { login, type LoginData, type LoginResponse } from '../api/login'

export function useLogin() {
  const [loading, setLoading] = useState<boolean>(false)

  const submitLogin = async (
    data: LoginData
  ): Promise<LoginResponse | null> => {
    setLoading(true)

    try {
      return await login(data)
    } catch (err) {
      console.error('Login failed:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitLogin, loading }
}
