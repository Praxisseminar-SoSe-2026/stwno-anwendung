import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type Dormitory = {
  id: number
  name: string
  address: string
  city: string
  zip_code: string
}

export type DormitoryCreate = {
  name: string
  address: string
  city: string
  zip_code: string
}

export type DormitoryUpdate = {
  name?: string
  address?: string
  city?: string
  zip_code?: string
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

export async function getDormitories(): Promise<Dormitory[]> {
  const res = await apiFetch(`${BASE_URL}/dormitories`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function createDormitory(
  data: DormitoryCreate
): Promise<Dormitory> {
  const res = await apiFetch(`${BASE_URL}/dormitories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateDormitory(
  id: number,
  data: DormitoryUpdate
): Promise<Dormitory> {
  const res = await apiFetch(`${BASE_URL}/dormitories/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function deleteDormitory(
  id: number,
): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/dormitories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
}
