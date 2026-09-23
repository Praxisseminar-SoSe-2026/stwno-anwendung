import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  addComment as addRequestComment,
  setRepairEntryTime,
  updateRepairStatus,
  updateRoomBookingStatus,
  type RequestStatus,
  type RequestType,
  type TicketRequest,
} from '../api/requests'

export function useRequestActions(
  id: number,
  type: RequestType,
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
    updateStatus: (status: RequestStatus) =>
      run(() =>
        type === 'repair'
          ? updateRepairStatus(id, status)
          : updateRoomBookingStatus(id, status)
      ),
    setEntryTime: (timeSlotProposalId: number) =>
      run(() => setRepairEntryTime(id, timeSlotProposalId)),
    addComment: (text: string) => run(() => addRequestComment(id, text)),
  }
}
