const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type Dormitory = {
  id: number
  name: string
  address: string
  city: string
  zip_code: string
}

export async function getDormitories(): Promise<Dormitory[]> {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`${BASE_URL}/dormitories`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new Error('Failed to load dormitories')
  }

  return res.json()
}
