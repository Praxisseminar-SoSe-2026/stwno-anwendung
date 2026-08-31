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
} from '@mui/material'
import { createRoomBooking } from '../../api/requests'
import { useCommunityRooms } from '../../hooks/useCommunityRooms'

// Todo: Add Authentification

export function RoomBookingCreatePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { communityRooms } = useCommunityRooms()
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

  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const handleSave = async () => {
    if (communityRoomId === null || !startDate || !endDate) return
    setSaving(true)
    setActionError(null)
    try {
      await createRoomBooking({
        community_room_id: communityRoomId,
        start_date: startDate,
        end_date: endDate,
        regular_key_exchange_possible: regularKeyExchangePossible,
        alternative_key_exchange_date: regularKeyExchangePossible
          ? null
          : alternativeKeyExchangeDate,
      })
      navigate(`/gemeinschaftsraum`)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={2}>
        {/* community room */}
        <Typography>
          {t('roomBooking.bookCommunityRoom', {
            communityRoomName: selectedRoom?.name ?? '',
          })}
        </Typography>
        {/* startDate */}
        <TextField
          label={t('roomBooking.startDate')}
          value={startDate}
          type={'date'}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        {/* endDate */}
        <TextField
          label={t('roomBooking.endDate')}
          value={endDate}
          type={'date'}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
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
            <FormControlLabel value="true" control={<Radio />} label="ja" />
            <FormControlLabel value="false" control={<Radio />} label="nein" />
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
          />
        )}

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              saving ||
              !startDate ||
              !endDate ||
              (!regularKeyExchangePossible && !alternativeKeyExchangeDate)
            }
          >
            {t('common.create')}
          </Button>
          <Button
            onClick={() => navigate('/gemeinschaftsraum')}
            disabled={saving}
          >
            {t('common.cancel')}
          </Button>
        </Stack>

        {actionError && <Typography color="error">{actionError}</Typography>}
      </Stack>
    </Paper>
  )
}
