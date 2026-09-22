import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type ResidentInfo = {
  id: number
  first_name: string
  last_name: string
  flat_number: string | null
}

export type AccessTimeSlot = {
  id: number
  start_time: string
  end_time: string
}

export type AccessTimeSlotHistoryEntry = {
  id: number
  start_time: string
  end_time: string
  changed_by: ResidentInfo
  changed_at: string | null
}

export type Comment = {
  id: number
  author: ResidentInfo
  text: string
  created_at: string | null
}

export type StatusHistoryEntry = {
  id: number
  status: RequestStatus
  changed_by: ResidentInfo
  changed_at: string | null
}

export type RequestType = 'repair' | 'room'

export type RequestStatus = 'open' | 'in_progress' | 'closed' | 'denied'

export type AccessTimeSlotProposal = {
  id: number
  start_time: string
  end_time: string
}

export type TicketRequest = {
  id: number
  type: RequestType
  status: RequestStatus
  created_at: string | null
  resident: ResidentInfo
  can_edit: boolean
  location: string | null
  description: string | null
  image_url: string | null
  entry_permission: boolean | null
  proposed_date_note: string | null
  proposed_time_slots: AccessTimeSlotProposal[]
  access_time_slot: AccessTimeSlot | null
  access_time_slot_history: AccessTimeSlotHistoryEntry[]
  comments: Comment[]
  status_history: StatusHistoryEntry[]
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

export type RoomBooking = {
  id: number
  community_room_id: number
  dormitory_id: number
  start_datetime: string
  end_datetime: string
  status: RequestStatus
}

export type RoomRequestCreate = {
  community_room_id: number
  start_date: string
  end_date: string
  regular_key_exchange_possible: boolean
  alternative_key_exchange_date: string | null
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
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
  const res = await apiFetch(`${BASE_URL}/requests`, { headers: authHeaders() })
  return handleResponse(res)
}

export async function getRoomBookings(): Promise<RoomBooking[]> {
  const res = await apiFetch(`${BASE_URL}/requests/room_booking`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function getRequestById(id: number): Promise<TicketRequest> {
  const res = await apiFetch(`${BASE_URL}/requests/${id}`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function createRepairRequest(
  payload: CreateRepairRequestPayload
): Promise<TicketRequest> {
  const res = await apiFetch(`${BASE_URL}/requests/repair`, {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export async function createRoomBooking(
  data: RoomRequestCreate
): Promise<TicketRequest> {
  const res = await apiFetch(`${BASE_URL}/requests/room_booking`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateRoomBookingStatus(
  id: number,
  status: RequestStatus
): Promise<TicketRequest> {
  const res = await apiFetch(`${BASE_URL}/requests/room_booking/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
  return handleResponse(res)
}

export async function updateRepairStatus(
  id: number,
  status: RequestStatus
): Promise<TicketRequest> {
  const res = await apiFetch(`${BASE_URL}/requests/repair/${id}/status`, {
    method: 'PATCH',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ status }),
  })
  return handleResponse(res)
}

export async function setRepairEntryTime(
  id: number,
  timeSlotProposalId: number
): Promise<TicketRequest> {
  const res = await apiFetch(`${BASE_URL}/requests/repair/${id}/entry-time`, {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ time_slot_proposal_id: timeSlotProposalId }),
  })
  return handleResponse(res)
}

export async function addComment(id: number, text: string): Promise<TicketRequest> {
  const res = await apiFetch(`${BASE_URL}/requests/${id}/comments`, {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ text }),
  })
  return handleResponse(res)
}
