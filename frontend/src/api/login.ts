const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type LoginData = {
  email: string
  password: string
}

export type LoginResponse = {
  response: string
}

// call API Endpoint /login
// ToDo: adjust and complete API Call when implemented in backend
export async function login(data: LoginData): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Login failed')
  }

  return res.json()
}
