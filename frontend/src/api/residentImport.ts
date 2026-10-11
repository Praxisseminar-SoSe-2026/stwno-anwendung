import { apiFetch } from './apiFetch.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export type ImportIssue = {
  row_number: number
  message: string
}

export type ImportReport = {
  success: boolean
  created: number
  updated: number
  unchanged: number
  errors: ImportIssue[]
  warnings: ImportIssue[]
}

export async function importResidentMasterData(
  file: File
): Promise<ImportReport> {
  const token = localStorage.getItem('access_token')
  const formData = new FormData()
  formData.append('file', file)

  const res = await apiFetch(`${BASE_URL}/import/resident-master-data`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    throw new Error(
      typeof errorBody?.detail === 'string' ? errorBody.detail : 'Import failed'
    )
  }

  return res.json()
}