const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type RequestType = 'repair' | 'room'

export type TicketRequest = {
  id: number
  type: RequestType
  status: string
  created_at: string | null
  resident_id: number
  location: string | null
  description: string | null
  image_url: string | null
  community_room_id: number | null
  start_datetime: string | null
  end_datetime: string | null
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token')
  return { Authorization: `Bearer ${token}` }
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
