import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type Announcement = {
  id: number
  title: string
  text: string
  image_url: string | null
  important: boolean | null
  author_id: number
  created_at: string | null
  dormitory_id: number | null
}

export type AnnouncementInput = {
  title: string
  text: string
  image_url?: string | null
  important?: boolean
  dormitory_id?: number | null
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

export async function getAnnouncements(): Promise<Announcement[]> {
  const res = await fetch(`${BASE_URL}/announcements`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function getAnnouncement(id: number): Promise<Announcement> {
  const res = await fetch(`${BASE_URL}/announcements/${id}`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function updateAnnouncement(
  id: number,
  data: Partial<AnnouncementInput>
): Promise<Announcement> {
  const res = await fetch(`${BASE_URL}/announcements/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function deleteAnnouncement(id: number): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/announcements/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
}

export async function createAnnouncement(
  data: AnnouncementInput
): Promise<Announcement> {
  const res = await apiFetch(`${BASE_URL}/announcements`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}
