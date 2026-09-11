const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CreateLaundryBookingPayload = {
  laundry_machine_id: number
  duration: number
}

export type LaundryBooking = {
  id: number
  laundry_machine_id: number
  resident_id: number
  started_at: string
  ends_at: string
  cancelled_at: string | null
}

// Todo: move this functions to shared file and access it from there
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

export async function createLaundryBooking(
  data: CreateLaundryBookingPayload
): Promise<LaundryBooking> {
  const res = await fetch(`${BASE_URL}/laundry/booking`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}
