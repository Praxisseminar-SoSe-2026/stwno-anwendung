import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type SetPasswordData = {
  token: string
  password: string
}

export async function setPassword(data: SetPasswordData): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/registration/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Setting password failed')
  }
}
