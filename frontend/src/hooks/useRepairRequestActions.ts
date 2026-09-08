import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  addRepairComment,
  setRepairEntryTime,
  updateRepairStatus,
  type RepairStatus,
  type TicketRequest,
} from '../api/requests'

export function useRepairRequestActions(
  id: number,
  onSuccess: (request: TicketRequest) => void
) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  async function run(action: () => Promise<TicketRequest>) {
    setSubmitting(true)
    setError(null)
    try {
      const updated = await action()
      onSuccess(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('request.actionError'))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    submitting,
    error,
    updateStatus: (status: RepairStatus) =>
      run(() => updateRepairStatus(id, status)),
    setEntryTime: (timeSlotProposalId: number) =>
      run(() => setRepairEntryTime(id, timeSlotProposalId)),
    addComment: (text: string) => run(() => addRepairComment(id, text)),
  }
}