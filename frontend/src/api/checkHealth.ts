import {apiFetch} from "./apiFetch.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// call API Endpoint /health
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await apiFetch(`${BASE_URL}/health`)
    return res.ok
  } catch (err) {
    console.error('Health check failed:', err)
    return false
  }
}
