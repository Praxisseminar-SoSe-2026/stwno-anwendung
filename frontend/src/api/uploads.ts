const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type UploadedImage = {
  url: string
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  const token = localStorage.getItem('access_token')
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/uploads/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(errorBody?.detail ?? 'Upload failed')
  }

  return res.json()
}
