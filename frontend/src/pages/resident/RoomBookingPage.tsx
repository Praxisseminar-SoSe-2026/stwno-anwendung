import { useTranslation } from 'react-i18next'
import {
  CircularProgress,
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
  const { communityRooms, loading, error } = useCommunityRooms()
  const { roomBookings } = useRoomBookings()
  const [roomId, setRoomId] = useState<number | null>(null)

  {
    /* filter roomBookings for accepted requests for selected room */
  }
  const roomBookingEvents: RoomBookingEvent[] = roomId
    ? roomBookings
        .filter(
          (booking) =>
            booking.community_room_id === roomId &&
            /* Todo: discuss universal naming of stati  */
            (booking.status === 'accepted' || booking.status === 'Bestätigt')
        )
        .map((booking) => ({
          id: String(booking.id),
          title: t('roomBooking.occupied'),
          start: booking.start_datetime,
          end: booking.end_datetime,
        }))
    : []

  return (
    <Stack spacing={10}>
      <Typography variant="h1">{t('roomBooking.title')}</Typography>
      {error && <Typography color="error">{error}</Typography>}

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
      {loading && <CircularProgress />}
      <Calendar events={roomBookingEvents} />
    </Stack>
  )
}
