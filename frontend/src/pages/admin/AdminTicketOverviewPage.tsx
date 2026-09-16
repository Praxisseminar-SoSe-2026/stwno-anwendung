import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  Stack,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
} from '@mui/material'
import { useRequests } from '../../hooks/useRequests'
import { useAuth } from '../../contexts/AuthContext'
import type {
  TicketRequest,
  RequestType,
  RequestStatus,
} from '../../api/requests'
import { useHasRole } from '../../hooks/useHasRole.ts'
import { STAFF_ROLES } from '../../constants/roles.ts'

const STATUS_COLUMNS: { key: string; matches: RequestStatus[] }[] = [
  { key: 'Offen', matches: ['open'] },
  { key: 'In Bearbeitung', matches: ['in_progress'] },
  { key: 'Abgelehnt/Geschlossen', matches: ['closed', 'denied'] },
]

const TYPE_LABELS: Record<RequestType, string> = {
  repair: 'repair',
  room: 'room',
}

function ticketTitle(ticket: TicketRequest): string {
  if (ticket.type === 'repair') {
    return `${ticket.location}: ${ticket.description}`
  }
  return ` ${
    ticket.start_datetime &&
    new Date(ticket.start_datetime).toLocaleDateString()
  } -> ${
    ticket.end_datetime && new Date(ticket.end_datetime).toLocaleDateString()
  }`
}

export function AdminTicketOverviewPage() {
  const { t } = useTranslation()
  const { loading: authLoading } = useAuth()
  const { requests, loading, error } = useRequests()

  const canView = useHasRole(STAFF_ROLES)

  if (authLoading || loading) return <CircularProgress />

  if (!canView) {
    return <Typography>{t('adminTicketOverview.notAuthorized')}</Typography>
  }

  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Stack spacing={2}>
      <Typography variant="h1">
        {t('adminTicketOverview.titleShort')}
      </Typography>

      <Grid container spacing={2}>
        {STATUS_COLUMNS.map((column) => {
          const columnRequests = requests.filter((r) =>
            column.matches.includes(r.status)
          )
          return (
            <Grid key={column.key} size={{ xs: 12, md: 4 }}>
              <Typography variant="h4" gutterBottom>
                {t(`request.status.${column.matches.join('/')}`)} (
                {columnRequests.length})
              </Typography>
              <Stack spacing={1}>
                {columnRequests.map((ticket) => (
                  <Card key={ticket.id} variant="outlined">
                    <CardActionArea
                      component={Link}
                      to={`/admin/tickets/${ticket.id}`}
                    >
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography>
                            {ticket.created_at &&
                              new Date(ticket.created_at).toLocaleDateString()}
                          </Typography>
                          <Chip
                            label={t(
                              `request.type.${TYPE_LABELS[ticket.type]}`
                            )}
                            color={
                              ticket.type === 'repair' ? 'primary' : 'secondary'
                            }
                          />
                          <Typography>{`# ${ticket.id}`}</Typography>
                        </Stack>
                        <Typography variant="h4" color="text.secondary">
                          {ticketTitle(ticket)}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
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
