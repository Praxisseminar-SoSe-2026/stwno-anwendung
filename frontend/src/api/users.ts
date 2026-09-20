import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type UserList = {
  id: number
  first_name: string
  last_name: string
  email: string
  person_number: string
  flat_number: string | null
  contract_end: string | null
  dormitory_id: number | null
  created_at: string | null
  roles: string[]
}

export type UserUpdate = {
  first_name?: string
  last_name?: string
  email?: string
  flat_number?: string | null
  contract_end?: string | null
  dormitory_id?: number | null
  roles?: string[]
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
  return res.json()
}

export async function getUsers(): Promise<UserList[]> {
  const res = await apiFetch(`${BASE_URL}/users`, { headers: authHeaders() })
  return handleResponse(res)
}

export async function updateUser(
  id: number,
  data: UserUpdate
): Promise<UserList> {
  const res = await apiFetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}
