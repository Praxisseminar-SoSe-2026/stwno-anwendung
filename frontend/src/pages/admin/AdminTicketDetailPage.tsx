import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import {
  Stack,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Box,
  Divider,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import { useRequest } from '../../hooks/useRequest'
import { useRepairRequestActions } from '../../hooks/useRepairRequestActions'
import { useAuth } from '../../contexts/AuthContext'
import type {
  RepairStatus,
  Comment,
  StatusHistoryEntry,
} from '../../api/requests'

const ALLOWED_ROLES = ['admin', 'mitarbeiter', 'hausmeister']

const REPAIR_STATUSES: RepairStatus[] = [
  'Offen',
  'In Bearbeitung',
  'Erledigt',
  'Abgelehnt',
]

type TimelineEntry =
  | { key: string; at: string | null; kind: 'comment'; comment: Comment }
  | {
  key: string
  at: string | null
  kind: 'status'
  entry: StatusHistoryEntry
}

export function AdminTicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { hasRole, loading: authLoading } = useAuth()
  const { request, loading, error, setRequest } = useRequest(Number(id))
  const {
    submitting,
    error: actionError,
    updateStatus,
    setEntryTime,
    addComment,
  } = useRepairRequestActions(Number(id), setRequest)

  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(
    null
  )
  const [commentDraft, setCommentDraft] = useState('')

  if (authLoading || loading) return <CircularProgress />

  const canView = ALLOWED_ROLES.some((role) => hasRole(role))
  if (!canView) {
    return <Typography>{t('adminTicketOverview.notAuthorized')}</Typography>
  }

  if (error) return <Typography color="error">{error}</Typography>
  if (!request) return null

  const timeline: TimelineEntry[] = [
    ...request.comments.map((comment) => ({
      key: `comment-${comment.id}`,
      at: comment.created_at,
      kind: 'comment' as const,
      comment,
    })),
    ...request.status_history.map((entry) => ({
      key: `status-${entry.id}`,
      at: entry.changed_at,
      kind: 'status' as const,
      entry,
    })),
  ].sort(
    (a, b) => new Date(a.at ?? 0).getTime() - new Date(b.at ?? 0).getTime()
  )

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography>
            {request.created_at &&
              new Date(request.created_at).toLocaleString()}
          </Typography>
          <Chip
            label={t(`request.type.${request.type}`)}
            color={request.type === 'repair' ? 'primary' : 'secondary'}
          />
          <Typography>{`# ${request.id}`}</Typography>
          <Chip label={t(`request.status.${request.status}`)} />
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            className="print-button"
          >
            {t('request.exportPdf')}
          </Button>
        </Stack>

        <Typography>
          <strong>{t('request.author')}:</strong> {request.resident.first_name}{' '}
          {request.resident.last_name}
          {request.resident.flat_number && ` (${request.resident.flat_number})`}
        </Typography>

        {request.type === 'repair' && (
          <>
            <Typography>
              <strong>{t('request.location')}:</strong> {request.location}
            </Typography>
            <Typography whiteSpace="pre-wrap">{request.description}</Typography>

            {request.image_url && (
              <Box
                component="img"
                src={request.image_url}
                alt=""
                sx={{ maxWidth: 320, borderRadius: 1 }}
              />
            )}

            <Typography>
              <strong>{t('repairRequest.entryPermission')}:</strong>{' '}
              {request.entry_permission
                ? t('repairRequest.yes')
                : t('repairRequest.no')}
            </Typography>

            {!request.entry_permission && request.proposed_date_note && (
              <Typography>
                <strong>{t('repairRequest.proposedDate')}:</strong>{' '}
                {request.proposed_date_note}
              </Typography>
            )}

            {!request.entry_permission &&
              request.proposed_time_slots.length > 0 && (
                <Typography>
                  <strong>{t('request.proposedSlots')}:</strong>{' '}
                  {request.proposed_time_slots
                    .map((slot) => new Date(slot.start_time).toLocaleString())
                    .join(', ')}
                </Typography>
              )}

            {request.access_time_slot && (
              <Typography>
                <strong>{t('request.finalSlot')}:</strong>{' '}
                {new Date(request.access_time_slot.start_time).toLocaleString()}
              </Typography>
            )}
          </>
        )}

        {request.type === 'room' && (
          <>
            <Typography>
              <strong>{t('request.start')}:</strong>{' '}
              {request.start_datetime &&
                new Date(request.start_datetime).toLocaleDateString()}
            </Typography>
            <Typography>
              <strong>{t('request.end')}:</strong>{' '}
              {request.end_datetime &&
                new Date(request.end_datetime).toLocaleDateString()}
            </Typography>
          </>
        )}

        <Divider />

        <Typography variant="h4">{t('request.history')}</Typography>
        <Stack spacing={1}>
          {timeline.map((item) => (
            <Typography key={item.key} variant="body2">
              <strong>
                {item.kind === 'comment'
                  ? `${item.comment.author.first_name} ${item.comment.author.last_name}`
                  : `${item.entry.changed_by.first_name} ${item.entry.changed_by.last_name}`}
              </strong>{' '}
              {item.at && new Date(item.at).toLocaleString()}
              {' — '}
              {item.kind === 'comment'
                ? item.comment.text
                : t('request.statusChanged', { status: item.entry.status })}
            </Typography>
          ))}
          {timeline.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('request.noHistory')}
            </Typography>
          )}
        </Stack>

        {request.type === 'repair' && request.can_edit && (
          <>
            <Divider />
            <Typography variant="h4">{t('common.edit')}</Typography>

            {actionError && <Alert severity="error">{actionError}</Alert>}

            <TextField
              select
              label={t('request.changeStatus')}
              value={request.status}
              disabled={submitting}
              onChange={(e) => updateStatus(e.target.value as RepairStatus)}
              sx={{ maxWidth: 260 }}
            >
              {REPAIR_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>

            {request.proposed_time_slots.length > 0 && (
              <Stack spacing={1}>
                <Typography>{t('request.chooseSlot')}</Typography>
                <RadioGroup
                  value={selectedProposalId ?? ''}
                  onChange={(e) =>
                    setSelectedProposalId(Number(e.target.value))
                  }
                >
                  {request.proposed_time_slots.map((slot) => (
                    <FormControlLabel
                      key={slot.id}
                      value={slot.id}
                      control={<Radio />}
                      label={new Date(slot.start_time).toLocaleString()}
                    />
                  ))}
                </RadioGroup>
                <Button
                  variant="contained"
                  disabled={submitting || selectedProposalId === null}
                  onClick={() =>
                    selectedProposalId !== null &&
                    setEntryTime(selectedProposalId)
                  }
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {t('request.setEntryTime')}
                </Button>
              </Stack>
            )}

            <Stack spacing={1}>
              <TextField
                multiline
                minRows={2}
                label={t('request.commentPlaceholder')}
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
              />
              <Button
                variant="contained"
                disabled={submitting || commentDraft.trim() === ''}
                onClick={() => {
                  addComment(commentDraft)
                  setCommentDraft('')
                }}
                sx={{ alignSelf: 'flex-start' }}
              >
                {t('request.addComment')}
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  )
}
