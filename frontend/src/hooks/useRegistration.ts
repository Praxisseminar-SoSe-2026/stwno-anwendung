import {
  register,
  type RegistrationData,
  type RegistrationStartedResponse,
} from '../api/registration.ts'
import { useState } from 'react'

export function useRegistration() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submitRegistration = async (
    data: RegistrationData
  ): Promise<RegistrationStartedResponse | null> => {
    setSubmitting(true)
    setError(null)
    try {
      return await register(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      return null
    } finally {
      setSubmitting(false)
    }
  }
  return { submitRegistration, submitting, error }
}
