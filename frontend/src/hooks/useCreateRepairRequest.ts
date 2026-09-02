import { useState } from 'react'
import {
  createRepairRequest,
  type CreateRepairRequestPayload,
  type TicketRequest,
} from '../api/requests'
import { useTranslation } from 'react-i18next'

export function useCreateRepairRequest() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const submitRepairRequest = async (
    payload: CreateRepairRequestPayload
  ): Promise<TicketRequest | null> => {
    setLoading(true)
    setError(null)

    try {
      return await createRepairRequest(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('repairRequest.error'))
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submitRepairRequest, loading, error }
}