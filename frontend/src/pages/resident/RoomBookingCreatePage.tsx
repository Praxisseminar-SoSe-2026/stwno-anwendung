import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material'
import { useCreateRoomBooking } from '../../hooks/useCreateRoomBooking'
import { useCommunityRooms } from '../../hooks/useCommunityRooms'
import { Loading } from '../../components/Loading'

export function RoomBookingCreatePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    communityRooms,
    loading: roomsLoading,
    error: roomsError,
  } = useCommunityRooms()
  const { id } = useParams<{ id: string }>()
  const communityRoomId = id ? Number(id) : null
  const selectedRoom = communityRooms.find(
    (room) => room.id === communityRoomId
  )
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [regularKeyExchangePossible, setRegularKeyExchangePossible] =
    useState<boolean>(true)
  const [alternativeKeyExchangeDate, setAlternativeKeyExchangeDate] =
    useState('')

  const { submitRoomBooking, loading, error } = useCreateRoomBooking()

  const handleSave = async () => {
    if (communityRoomId === null || !startDate || !endDate) return
    const result = await submitRoomBooking({
      community_room_id: communityRoomId,
      start_date: startDate,
      end_date: endDate,
      regular_key_exchange_possible: regularKeyExchangePossible,
      alternative_key_exchange_date: regularKeyExchangePossible
        ? null
        : alternativeKeyExchangeDate,
    })
    if (result) {
      navigate(`/gemeinschaftsraum`)
    }
  }

  if (roomsLoading) return <Loading />
  if (roomsError) return <Typography color="error">{roomsError}</Typography>

  return (
    <Paper
      variant="outlined"
      sx={{ p: 4, width: { xs: '95%', md: '50%' }, alignSelf: 'center' }}
    >
      <Stack spacing={2}>
        {/* community room */}
        <Typography variant={'h4'}>
          {t('roomBooking.bookCommunityRoom', {
            communityRoomName: selectedRoom?.name ?? '',
          })}
        </Typography>
        <Divider />
        {/* startDate */}
        <TextField
          label={t('roomBooking.startDate')}
          value={startDate}
          type={'date'}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
          disabled={loading}
        />

        {/* endDate */}
        <TextField
          label={t('roomBooking.endDate')}
          value={endDate}
          type={'date'}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
          disabled={loading}
        />

        {/* key exchange */}
        {/* radio buttons made with docs [https://mui.com/material-ui/react-radio-button/]*/}
        <FormControl>
          <FormLabel>
            {t('roomBooking.regularKeyExchangePossibleQuestion')}
          </FormLabel>
          <RadioGroup
            defaultValue="true"
            onChange={(e) =>
              setRegularKeyExchangePossible(e.target.value === 'true')
            }
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="ja"
              disabled={loading}
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="nein"
              disabled={loading}
            />
          </RadioGroup>
        </FormControl>

        {regularKeyExchangePossible === false && (
          <TextField
            label={t('roomBooking.alternativeKeyExchangeDate')}
            value={alternativeKeyExchangeDate}
            type={'date'}
            onChange={(e) => setAlternativeKeyExchangeDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
            disabled={loading}
          />
        )}

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              loading ||
              !startDate ||
              !endDate ||
              (!regularKeyExchangePossible && !alternativeKeyExchangeDate)
            }
          >
            {loading ? t('common.creating') : t('common.create')}
          </Button>
          <Button
            onClick={() => navigate('/gemeinschaftsraum')}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
        </Stack>

        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </Paper>
  )
}
