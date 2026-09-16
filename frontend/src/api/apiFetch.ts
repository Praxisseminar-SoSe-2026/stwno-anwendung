export async function apiFetch(
  url: string,
  options: RequestInit = {} /*options for stuff like headers etc. -> default {}*/
): Promise<Response> {
  const res = await fetch(url, options)

  /*session end event*/
  if (res.status === 401) {
    window.dispatchEvent(new Event('auth:unauthorized'))
  }
  return res
}

/*waits for event to happen*/
export function unauthorized(callback: () => void): () => void {
  window.addEventListener('auth:unauthorized', callback)
  return () => window.removeEventListener('auth:unauthorized', callback)
}
