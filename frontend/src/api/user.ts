const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CurrentUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  dormitory_id: number | null
  roles: string[]
}

export async function getMe(): Promise<CurrentUser> {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new Error('Not authenticated')
  }

  return res.json()
}
