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
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSetPassword } from '../../hooks/useSetPassword.ts'

export function SetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { submitSetPassword, loading, error } = useSetPassword()
  const { t } = useTranslation()

  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const success = await submitSetPassword({ token, password })
    if (success) {
      navigate('/login')
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
        <Typography variant="h4">
          {t('registration.set_password_title')}
        </Typography>
        <Divider />
        {!token ? (
          <>
            <Alert severity="error">{t('registration.missing_token')}</Alert>
            <Link to="/registration">{t('registration.start_again')}</Link>
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
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder={t('registration.password')}
                helperText={t('registration.password_hint')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{ htmlInput: { minLength: 6 } }}
                required
                disabled={loading}
              />
            </FormControl>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? t('common.creating') : t('registration.create_account')}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        )}
      </Paper>
    </Stack>
  )
}
