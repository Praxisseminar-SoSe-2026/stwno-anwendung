const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CommunityRoom = {
  id: number
  name: string
  description: string | null
  dormitory_id: number
}

export type LaundryRoom = {
  id: number
  name: string
  dormitory_id: number
}

export type LaundryStatus = 'free' | 'occupied' | 'unknown'

export type LaundryMachine = {
  id: number
  laundry_room_id: number
  label: string
  type: string
  status: LaundryStatus
  occupied_until: string | null
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

export async function getCommunityRooms(): Promise<CommunityRoom[]> {
  const res = await fetch(`${BASE_URL}/infrastructure/community_rooms`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function getLaundryRooms(): Promise<LaundryRoom[]> {
  const res = await fetch(`${BASE_URL}/infrastructure/laundry_rooms`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function getLaundryMachines(
  laundryRoomId: number
): Promise<LaundryMachine[]> {
  const res = await fetch(
    `${BASE_URL}/infrastructure/laundry_rooms/${laundryRoomId}/laundry_machines`,
    {
      headers: authHeaders(),
    }
  )
  return handleResponse(res)
}
