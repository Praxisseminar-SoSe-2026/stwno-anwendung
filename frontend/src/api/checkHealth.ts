const BASE_URL = import.meta.env.VITE_API_BASE_URL

// call API Endpoint /health
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`)
    return res.ok
  } catch {
    return false
  }
}
