import { type SubmitEventHandler, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useRegistration } from '../../hooks/useRegistration.ts'

export function RegistrationPage() {
  const { submitRegistration, submitting, error } = useRegistration()
  const [personNumber, setPersonNumber] = useState('')
  const [email, setEmail] = useState('')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const { t, i18n } = useTranslation()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const result = await submitRegistration({
      person_number: personNumber,
      email,
      language: i18n.language,
    })
    if (result) {
      setSentTo(email)
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
        {sentTo ? (
          <>
            <Alert severity="success">
              {t('registration.check_mail', { email: sentTo })}
            </Alert>
            <Link to="/login">{t('registration.back_to_login')}</Link>
          </>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <TextField
                id="personNumber"
                name="personNumber"
                placeholder={t('registration.person_number')}
                value={personNumber}
                onChange={(e) => setPersonNumber(e.target.value)}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t('registration.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? t('common.loading') : t('registration.next_button')}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        )}
      </Paper>
    </Stack>
  )
}
