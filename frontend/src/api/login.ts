const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type LoginData = {
  email: string
  password: string
}

export type LoginResponse = {
  id: number
  email: string
  first_name: string
  last_name: string
  access_token: string
  token_type: string
  dormitory_id: number | null
  roles: string[]
}

// call API Endpoint /login
// ToDo: adjust and complete API Call when implemented in backend
export async function login(data: LoginData): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Login failed')
  }

  return res.json()
}
