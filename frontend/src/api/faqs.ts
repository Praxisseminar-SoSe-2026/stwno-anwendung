import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type FaqCategory = {
  id: number
  name: string
}

export type Faq = {
  id: number
  question: string
  answer: string
  category: FaqCategory
}

export type FaqInput = {
  question: string
  answer: string
  category_id: number
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
  return res.json()
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getFaqCategories(): Promise<FaqCategory[]> {
  const res = await apiFetch(`${BASE_URL}/faq/categories`)
  return handleResponse(res)
}

export async function getFaqs(): Promise<Faq[]> {
  const res = await apiFetch(`${BASE_URL}/faq`)
  return handleResponse(res)
}

export async function getFaq(id: number): Promise<Faq> {
  const res = await apiFetch(`${BASE_URL}/faq/${id}`)
  return handleResponse(res)
}

export async function createFaq(data: FaqInput): Promise<Faq> {
  const res = await apiFetch(`${BASE_URL}/faq`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function updateFaq(
  id: number,
  data: Partial<FaqInput>
): Promise<Faq> {
  const res = await apiFetch(`${BASE_URL}/faq/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function deleteFaq(id: number): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/faq/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Request failed')
  }
}
