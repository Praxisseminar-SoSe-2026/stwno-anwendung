import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { uploadImage } from '../api/uploads'

export function useImageUpload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const upload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const result = await uploadImage(file)
      setImageUrl(result.url)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('repairRequest.imageError')
      )
    } finally {
      setUploading(false)
    }
  }

  const clear = () => {
    setImageUrl(null)
    setError(null)
  }

  return { imageUrl, uploading, error, upload, clear }
}
