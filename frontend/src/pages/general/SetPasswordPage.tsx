import {
  Box,
  Button,
  FormControl,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router'
import { type SubmitEventHandler, useState } from 'react'
import { useSetPassword } from '../../hooks/useSetPassword.ts'
import { useTranslation } from 'react-i18next'

export function SetPasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { submitSetPassword, error } = useSetPassword()
  const { t } = useTranslation()

  const emailFromRegistrationPage =
    (location.state as { email?: string })?.email ?? ''
  const [email] = useState(emailFromRegistrationPage)
  const [password, setPassword] = useState('')

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const success = await submitSetPassword({ email, password })
    if (success) {
      console.log(`New Account for ${email}`)
      navigate('/login')
    }
  }
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        p: 4,
        gap: 2,
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl>
          <TextField
            id="email"
            name="email"
            type="email"
            value={email}
            slotProps={{ input: { readOnly: true } }}
          />
        </FormControl>
        <FormControl>
          <TextField
            id="password"
            name="password"
            type="password"
            placeholder={t('registration.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit">{t('registration.create_account')}</Button>
        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Paper>
  )
}
