const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type RequestType = 'repair' | 'room'

export type AccessTimeSlotProposal = {
  id: number
  start_time: string
  end_time: string
}

export type TicketRequest = {
  id: number
  type: RequestType
  status: string
  created_at: string | null
  resident_id: number
  location: string | null
  description: string | null
  image_url: string | null
  entry_permission: boolean | null
  proposed_date_note: string | null
  proposed_time_slots: AccessTimeSlotProposal[]
  community_room_id: number | null
  start_datetime: string | null
  end_datetime: string | null
}

export type CreateRepairRequestPayload = {
  description: string
  location: string
  image_url?: string | null
  entry_permission: boolean
  proposed_time_slots?: { start_time: string }[]
  proposed_date_note?: string | null
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token')
  return { Authorization: `Bearer ${token}` }
}

function jsonAuthHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', ...authHeaders() }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
  return res.json()
}

export async function getRequests(): Promise<TicketRequest[]> {
  const res = await fetch(`${BASE_URL}/requests`, { headers: authHeaders() })
  return handleResponse(res)
}

export async function getRequestById(id: number): Promise<TicketRequest> {
  const res = await fetch(`${BASE_URL}/requests/${id}`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function createRepairRequest(
  payload: CreateRepairRequestPayload
): Promise<TicketRequest> {
  const res = await fetch(`${BASE_URL}/requests/repair`, {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}
