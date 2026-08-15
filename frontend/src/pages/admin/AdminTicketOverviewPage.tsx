import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
} from '@mui/material'
import { useRequests } from '../../hooks/useRequests'
import { useAuth } from '../../contexts/AuthContext'
import type { TicketRequest, RequestType } from '../../api/requests'

const ALLOWED_ROLES = ['admin', 'mitarbeiter', 'hausmeister']

const STATUS_COLUMNS: { key: string; matches: string[] }[] = [
  { key: 'Offen', matches: ['Offen'] },
  { key: 'Bestätigt', matches: ['Bestätigt'] },
  { key: 'Abgelehnt/Geschlossen', matches: ['Abgelehnt', 'Geschlossen'] },
]

const TYPE_LABELS: Record<RequestType, string> = {
  repair: 'Reparatur',
  room: 'Gemeinschaftsraum',
}

function ticketTitle(ticket: TicketRequest): string {
  if (ticket.type === 'repair') {
    return `${ticket.location}: ${ticket.description}`
  }
  return ` ${ticket.start_datetime &&
                          new Date(ticket.start_datetime).toLocaleDateString()} -> ${ticket.end_datetime &&
                          new Date(ticket.end_datetime).toLocaleDateString()}`
}

export function AdminTicketOverviewPage() {
  const { t } = useTranslation()
  const { hasRole, loading: authLoading } = useAuth()
  const { requests, loading, error } = useRequests()

  if (authLoading || loading) return <CircularProgress />

  const canView = ALLOWED_ROLES.some((role) => hasRole(role))
  if (!canView) {
    return <Typography>{t('adminTicketOverview.notAuthorized')}</Typography>
  }

  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Stack spacing={2}>
      <Typography variant="h1">{t('adminTicketOverview.titleShort')}</Typography>

      <Grid container spacing={2}>
        {STATUS_COLUMNS.map((column) => {
          const columnRequests = requests.filter((r) =>
            column.matches.includes(r.status)
          )
          return (
            <Grid key={column.key} size={{ xs: 12, md: 4 }}>
              <Typography variant="h4" gutterBottom>
                {column.key} ({columnRequests.length})
              </Typography>
              <Stack spacing={1}>
                {columnRequests.map((ticket) => (
                  <Card key={ticket.id} variant="outlined">
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>
                        {ticket.created_at &&
                          new Date(ticket.created_at).toLocaleDateString()}
                      </Typography>
                        <Chip
                          label={TYPE_LABELS[ticket.type]}
                          color={
                            ticket.type === 'repair' ? 'primary' : 'secondary'
                          }
                        />
                        <Typography>
                          {`# ${ticket.id}`}
                        </Typography>
                      </Stack>
                      <Typography variant="h4" color="text.secondary">
                        {ticketTitle(ticket)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {columnRequests.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t('adminTicketOverview.empty')}
                  </Typography>
                )}
              </Stack>
            </Grid>
          )
        })}
      </Grid>
    </Stack>
  )
}
