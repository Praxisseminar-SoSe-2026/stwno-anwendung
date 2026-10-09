import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type RegistrationData = {
  person_number: string
  email: string
  language: string
}

export type RegistrationStartedResponse = {
  message: string
}

export async function register(
  data: RegistrationData
): Promise<RegistrationStartedResponse> {
  const res = await apiFetch(`${BASE_URL}/registration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Registration failed')
  }

  return res.json()
}
