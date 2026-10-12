import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material'
import { useRequests } from '../../hooks/useRequests.ts'
import { useAuth } from '../../contexts/AuthContext.tsx'
import { Loading } from '../../components/Loading.tsx'
import { useCommunityRooms } from '../../hooks/useCommunityRooms.ts'

const STATUS_COLOR: Record<
  string,
  'default' | 'warning' | 'success' | 'error'
> = {
  open: 'default',
  in_progress: 'warning',
  closed: 'success',
  denied: 'error',
}

export function TicketsPage() {
  const { t } = useTranslation()
  const { requests, loading, error } = useRequests()
  const { communityRooms } = useCommunityRooms()
  const { user } = useAuth()

  const myTickets = requests.filter((ticket) => ticket.resident.id === user?.id)

  function ticketTitle(ticket: (typeof requests)[number]): string {
    if (ticket.type === 'repair') {
      return `${t('request.type.repair')}  – ${new Date(ticket.created_at).toLocaleDateString()}`
    }
    return `${t('request.type.room')} – ${new Date(ticket.created_at).toLocaleDateString()}`
  }

  function communityRoomName(name: string | null): string {
    if (name === null) return ''
    return (
      communityRooms.find((r) => r.name === name)?.name ??
      `${t('ticket.communityRoom')} #${name}`
    )
  }

  function ticketBody(ticket: (typeof requests)[number]): string {
    if (ticket.type === 'repair') {
      return `${ticket.location}: ${ticket.description}`
    }
    return `${communityRoomName(ticket.community_room?.name)}: ${t('request.start')} ${new Date(ticket.start_datetime).toLocaleDateString()} - ${t('request.end')} ${new Date(ticket.end_datetime).toLocaleDateString()}`
  }

  if (loading) return <Loading />
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Stack
      spacing={3}
      sx={{ width: { xs: '100%', md: '50%' }, alignSelf: 'center' }}
    >
      <Typography variant="h1">{t('request.myTickets')}</Typography>
      <Divider />

      {myTickets.length === 0 && <Typography>{t('request.empty')}</Typography>}

      {myTickets.map((ticket) => (
        <Card key={ticket.id} variant="outlined">
          <CardContent>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <Typography sx={{ wordBreak: 'break-word' }}>
                {ticketTitle(ticket)}
              </Typography>
              <Chip
                label={t(`request.status.${ticket.status}`, {
                  context: ticket.type === 'room' ? 'room_booking' : undefined,
                })}
                color={STATUS_COLOR[ticket.status] ?? 'default'}
                size="small"
              />
            </Stack>
            <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
              {ticketBody(ticket)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
