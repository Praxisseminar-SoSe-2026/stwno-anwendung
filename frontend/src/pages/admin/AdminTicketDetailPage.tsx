import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import {
  Stack,
  Typography,
  Paper,
  Chip,
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
  Comment,
  StatusHistoryEntry,
  RequestStatus,
  AccessTimeSlotHistoryEntry,
} from '../../api/requests'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { STAFF_ROLES } from '../../constants/roles.ts'

import { Loading } from '../../components/Loading'
import EditIcon from '@mui/icons-material/Edit'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import EngineeringIcon from '@mui/icons-material/Engineering'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import type { SvgIconComponent } from '@mui/icons-material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import { BackButton } from '../../components/BackButton'

const REPAIR_STATUSES: RequestStatus[] = [
  'open',
  'in_progress',
  'closed',
  'denied',
]

const STATUS_TIMELINE_ICONS: Record<
  RequestStatus,
  { Icon: SvgIconComponent; color: string }
> = {
  open: { Icon: QuestionMarkIcon, color: 'info.main' },
  in_progress: { Icon: EngineeringIcon, color: 'warning.main' },
  closed: { Icon: CheckCircleIcon, color: 'success.main' },
  denied: { Icon: CancelIcon, color: 'error.main' },
}

type TimelineEntry =
  | { key: string; at: string | null; kind: 'comment'; comment: Comment }
  | {
      key: string
      at: string | null
      kind: 'status'
      entry: StatusHistoryEntry
    }
  | {
      key: string
      at: string | null
      kind: 'entry_time'
      entry: AccessTimeSlotHistoryEntry
    }

export function AdminTicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  const { loading: authLoading } = useAuth()

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

  const canView = useHasRole(STAFF_ROLES)

  if (authLoading || loading) return <Loading />

  if (!canView) {
    return <Typography>{t('adminTicketOverview.notAuthorized')}</Typography>
  }

  if (error) return <Typography color="error">{error}</Typography>
  if (!request) return null

  // create list of time line entries and sort them by time
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
    ...request.access_time_slot_history.map((entry) => ({
      key: `entry-time-${entry.id}`,
      at: entry.changed_at,
      kind: 'entry_time' as const,
      entry,
    })),
  ].sort(
    (a, b) => new Date(a.at ?? 0).getTime() - new Date(b.at ?? 0).getTime()
  )

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '50%',
        alignSelf: 'center',
        p: 4,
        gap: 2,
      }}
    >
      <BackButton />
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
        {/* ---- Ticket Details ---- */}
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
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {request.description}
            </Typography>

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
        {/* ---- Ticket History ---- */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {t('request.history')}
        </Typography>
        <Stack spacing={0}>
          {timeline.map((item, index) => {
            const isLast = index === timeline.length - 1
            const { Icon, color } =
              item.kind === 'comment'
                ? { Icon: EditIcon, color: 'grey.600' }
                : item.kind === 'entry_time'
                  ? { Icon: EventAvailableIcon, color: 'secondary.main' }
                  : STATUS_TIMELINE_ICONS[item.entry.status]
            const authorName =
              item.kind === 'comment'
                ? `${item.comment.author.first_name} ${item.comment.author.last_name}`
                : `${item.entry.changed_by.first_name} ${item.entry.changed_by.last_name}`

            return (
              <Stack key={item.key} direction="row" spacing={1.5}>
                <Stack sx={{ alignItems: 'center', flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: color,
                      color: 'common.white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 14 }} />
                  </Box>
                  {!isLast && (
                    <Box
                      sx={{
                        width: '2px',
                        flexGrow: 1,
                        bgcolor: 'divider',
                        my: 0.5,
                      }}
                    />
                  )}
                </Stack>
                <Box sx={{ pb: 2, minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>{authorName}</strong>{' '}
                    {item.kind === 'comment'
                      ? t('request.commented')
                      : item.kind === 'entry_time'
                        ? t('request.entryTimeSet', {
                            time: new Date(
                              item.entry.start_time
                            ).toLocaleString(),
                          })
                        : t('request.statusChanged', {
                            status: t(`request.status.${item.entry.status}`),
                          })}
                    {' · '}
                    {item.at && new Date(item.at).toLocaleString()}
                  </Typography>
                  {item.kind === 'comment' && (
                    <Typography variant="body2">{item.comment.text}</Typography>
                  )}
                </Box>
              </Stack>
            )
          })}
          {timeline.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              {t('request.noHistory')}
            </Typography>
          )}
        </Stack>

        {request.type === 'repair' && request.can_edit && (
          <>
            <Divider />
            {/* ---- Edit Status ---- */}
            <Typography variant="h4">{t('common.edit')}</Typography>

            {actionError && <Alert severity="error">{actionError}</Alert>}

            <TextField
              select
              label={t('request.changeStatus')}
              value={request.status}
              disabled={submitting}
              onChange={(e) => updateStatus(e.target.value as RequestStatus)}
              sx={{ maxWidth: 260 }}
            >
              {REPAIR_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(`request.status.${status}`)}
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
                      control={<Radio disabled={submitting} />}
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
                  {/*Todo: refactor hook to return different submitting states for choosing a time and commenting */}
                  {submitting ? t('common.saving') : t('request.setEntryTime')}
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
                disabled={submitting}
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
                {/*Todo: refactor hook to return different submitting states for choosing a time and commenting */}
                {submitting ? t('common.saving') : t('request.addComment')}
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  )
}
