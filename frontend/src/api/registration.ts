import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type RegistrationData = {
  person_number: string
}

export type RegistrationResponse = {
  id: number
  first_name: string
  last_name: string
  email: string
  person_number: string
  flat_number: string | null
  contract_end: string | null
  dormitory_id: number | null
  created_at: string | null
}

export async function register(
  data: RegistrationData
): Promise<RegistrationResponse> {
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
