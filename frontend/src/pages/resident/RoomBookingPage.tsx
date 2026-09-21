import { useTranslation } from 'react-i18next'
import {
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import FullCalendar from '@fullcalendar/react'
import themePlugin from '@fullcalendar/react/themes/monarch'
import dayGridPlugin from '@fullcalendar/react/daygrid'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/monarch/theme.css'
import '@fullcalendar/react/themes/monarch/palettes/purple.css'

import { useCommunityRooms } from '../../hooks/useCommunityRooms'
import { useRoomBookings } from '../../hooks/useRoomBookings'
import { useState } from 'react'
import { Link } from 'react-router'
import { Loading } from '../../components/Loading'

type RoomBookingEvent = {
  id: string
  title: string
  start: string
  end: string
}

// calendar setup, made with docs [https://fullcalendar.io/docs/react]
export default function Calendar({ events }: { events: RoomBookingEvent[] }) {
  return (
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      headerToolbar={{
        left: 'prev',
        center: 'title',
        right: 'next',
      }}
      eventContent={renderEventContent}
      eventColor={useTheme().palette.error.main}
    />
  )
}

function renderEventContent(eventInfo) {
  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <i>{eventInfo.event.title}</i>
    </div>
  )
}

export function RoomBookingPage() {
  const { t } = useTranslation()
  const {
    communityRooms,
    loading: roomsLoading,
    error: roomsError,
  } = useCommunityRooms()
  const {
    roomBookings,
    loading: bookingsLoading,
    error: bookingsError,
  } = useRoomBookings()
  const [roomId, setRoomId] = useState<number | null>(null)

  {
    /* filter roomBookings for accepted requests for selected room */
  }
  const roomBookingEvents: RoomBookingEvent[] = roomId
    ? roomBookings
        .filter((booking) => booking.community_room_id === roomId)
        /* Todo: implement standardized stati */
        /* && (booking.status === 'accepted' || booking.status === 'Bestätigt')) */
        .map((booking) => ({
          id: String(booking.id),
          title: t('roomBooking.occupied'),
          start: booking.start_datetime,
          end: booking.end_datetime,
        }))
    : []

  if (roomsLoading) return <Loading />
  if (roomsError) return <Typography color="error">{roomsError}</Typography>

  return (
    <Stack spacing={10}>
      <Typography variant="h1">{t('roomBooking.title')}</Typography>
      {/* select community room */}
      <TextField
        select
        label={t('roomBooking.selectCommunityRoom')}
        value={roomId ?? ''}
        onChange={(e) => setRoomId(Number(e.target.value))}
        disabled={communityRooms.length === 0}
        fullWidth
      >
        {communityRooms.map((room) => (
          <MenuItem key={room.id} value={room.id}>
            {room.name}
          </MenuItem>
        ))}
      </TextField>
      {roomId !== null &&
        (bookingsLoading ? (
          <Loading />
        ) : (
          <Stack>
            <Button
              component={Link}
              variant="contained"
              to={`/gemeinschaftsraum/anfrage/${roomId}`}
              sx={{ width: '50%', alignSelf: 'center' }}
            >
              +
            </Button>
            <Calendar events={roomBookingEvents} />
          </Stack>
        ))}
      {bookingsError && <Typography color="error">{bookingsError}</Typography>}
    </Stack>
  )
}
