import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Stack, Typography, Paper, Chip, CircularProgress } from '@mui/material'
import { useRequest } from '../../hooks/useRequest'
import { useAuth } from '../../contexts/AuthContext'
import type { RequestType } from '../../api/requests'

const ALLOWED_ROLES = ['admin', 'mitarbeiter', 'hausmeister']

const TYPE_LABELS: Record<RequestType, string> = {
  repair: 'Reparatur',
  room: 'Gemeinschaftsraum',
}

export function AdminTicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { hasRole, loading: authLoading } = useAuth()
  const { request, loading, error } = useRequest(Number(id))

  if (authLoading || loading) return <CircularProgress />

  const canView = ALLOWED_ROLES.some((role) => hasRole(role))
  if (!canView) {
    return <Typography>{t('adminTicketOverview.notAuthorized')}</Typography>
  }

  if (error) return <Typography color="error">{error}</Typography>
  if (!request) return null

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>
            {request.created_at &&
              new Date(request.created_at).toLocaleString()}
          </Typography>
          <Chip
            label={TYPE_LABELS[request.type]}
            color={request.type === 'repair' ? 'primary' : 'secondary'}
          />
          <Typography>{`# ${request.id}`}</Typography>
          <Chip label={request.status} />
        </Stack>

        {request.type === 'repair' && (
          <>
            <Typography>
              <strong>{t('request.location')}:</strong> {request.location}
            </Typography>
            <Typography whiteSpace="pre-wrap">{request.description}</Typography>
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
      </Stack>
    </Paper>
  )
}
