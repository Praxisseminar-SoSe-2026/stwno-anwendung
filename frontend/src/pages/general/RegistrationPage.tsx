import { type SubmitEventHandler, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
  Stack,
  Divider,
} from '@mui/material'
import { useRegistration } from '../../hooks/useRegistration.ts'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

export function RegistrationPage() {
  const { submitRegistration, submitting, error } = useRegistration()
  const navigate = useNavigate()
  const [personNumber, setPersonNumber] = useState('')
  const { t } = useTranslation()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const result = await submitRegistration({ person_number: personNumber })
    if (result) {
      console.log(`${result.email}`)
      navigate('/set-password', { state: { email: result.email } })
    }
  }
  return (
    <Stack
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '90%', sm: '60%', md: '30%' },
          alignSelf: 'center',
          p: 4,
          gap: 2,
        }}
      >
        <Typography variant="h4">{t('registration.create_account')}</Typography>
        <Divider />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
        >
          <FormControl>
            <TextField
              id="personNumber"
              name="personNumber"
              placeholder={t('registration.person_number')}
              value={personNumber}
              onChange={(e) => setPersonNumber(e.target.value)}
              style={{
                width: '100%',
              }}
              required
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{ marginTop: '1rem' }}
          >
            {submitting ? t('common.loading') : t('registration.next_button')}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Paper>
    </Stack>
  )
}
