import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CommunityRoom = {
  id: number
  name: string
  description: string | null
  dormitory_id: number
}

export type CommunityRoomCreate = {
  name: string
  description: string | null
  dormitory_id: number
}

export type CommunityRoomUpdate = {
  name: string
  description: string | null
}

export type LaundryRoom = {
  id: number
  name: string
  dormitory_id: number
}

export type LaundryRoomCreate = {
  name: string
  dormitory_id: number
}

export type LaundryRoomUpdate = {
  name: string
}

export type LaundryStatus = 'free' | 'occupied' | 'unknown'
export type LaundryMachineType = 'Washingmachine' | 'Dryer'

export type LaundryMachine = {
  id: number
  laundry_room_id: number
  label: string
  type: LaundryMachineType
  status: LaundryStatus
  occupied_until: string | null
  current_booking_id: number | null
  is_own_booking: boolean
}

export type LaundryMachineCreate = {
  laundry_room_id: number
  type: LaundryMachineType
  status: LaundryStatus
  label?: string
}

export type LaundryMachineUpdate = {
  laundry_room_id?: number
  type?: LaundryMachineType
  status?: LaundryStatus
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

/* Community room */

export async function getCommunityRooms(): Promise<CommunityRoom[]> {
  const res = await apiFetch(`${BASE_URL}/infrastructure/community_rooms`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function createCommunityRoom(
  data: CommunityRoomCreate
): Promise<CommunityRoom> {
  const res = await apiFetch(`${BASE_URL}/infrastructure/community_rooms`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateCommunityRoom(
  id: number,
  data: CommunityRoomUpdate
): Promise<CommunityRoom> {
  const res = await apiFetch(
    `${BASE_URL}/infrastructure/community_rooms/${id}`,
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }
  )
  return handleResponse(res)
}

export async function deleteCommunityRoom(id: number): Promise<void> {
  const res = await apiFetch(
    `${BASE_URL}/infrastructure/community_rooms/${id}`,
    {
      method: 'DELETE',
      headers: authHeaders(),
    }
  )
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
}

/* Laundry room */

export async function getLaundryRooms(): Promise<LaundryRoom[]> {
  const res = await apiFetch(`${BASE_URL}/infrastructure/laundry_rooms`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function createLaundryRoom(
  data: LaundryRoomCreate
): Promise<LaundryRoom> {
  const res = await apiFetch(`${BASE_URL}/infrastructure/laundry_rooms`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateLaundryRoom(
  id: number,
  data: LaundryRoomUpdate
): Promise<LaundryRoom> {
  const res = await apiFetch(`${BASE_URL}/infrastructure/laundry_rooms/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function deleteLaundryRoom(id: number): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/infrastructure/laundry_rooms/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
}

/* Laundry machines */

export async function getLaundryMachines(
  laundryRoomId: number
): Promise<LaundryMachine[]> {
  const res = await apiFetch(
    `${BASE_URL}/infrastructure/laundry_rooms/${laundryRoomId}/laundry_machines`,
    {
      headers: authHeaders(),
    }
  )
  return handleResponse(res)
}

export async function getLaundryMachineById(
  laundryMachineId: number
): Promise<LaundryMachine> {
  const res = await apiFetch(
    `${BASE_URL}/infrastructure/laundry_machines/${laundryMachineId}`,
    {
      headers: authHeaders(),
    }
  )
  return handleResponse(res)
}

export async function createLaundryMachine(
  data: LaundryMachineCreate
): Promise<LaundryMachine> {
  const res = await apiFetch(`${BASE_URL}/infrastructure/laundry_machines`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateLaundryMachine(
  id: number,
  data: LaundryMachineUpdate
): Promise<LaundryMachine> {
  const res = await apiFetch(
    `${BASE_URL}/infrastructure/laundry_machines/${id}`,
    {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    }
  )
  return handleResponse(res)
}

export async function deleteLaundryMachine(id: number): Promise<void> {
  const res = await apiFetch(
    `${BASE_URL}/infrastructure/laundry_machines/${id}`,
    {
      method: 'DELETE',
      headers: authHeaders(),
    }
  )
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
}
