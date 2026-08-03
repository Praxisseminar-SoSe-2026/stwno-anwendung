// based on template [https://mui.com/material-ui/getting-started/templates/sign-in/]
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import type { SubmitEventHandler } from 'react'
import { useLogin } from '../../hooks/useLogin.ts'
import {
  Typography,
  Paper,
  Box,
  Button,
  FormControl,
  TextField,
} from '@mui/material'

export function LoginPage() {
  const { t } = useTranslation()
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')

  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const { submitLogin, loading } = useLogin()

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (emailError || passwordError) {
      event.preventDefault()
      return
    }
    const data = new FormData(event.currentTarget)

    const response = submitLogin({
      email: data.get('email') as string,
      password: data.get('password') as string,
    })

    if (response) {
      console.log(response)
    }
  }

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement
    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage(t('login.emailInvalid'))
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage(t('login.passwordInvalid'))
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    return isValid
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
      <Typography variant="h2">{t('login.title')}</Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        {/* email input */}
        <FormControl>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder={t('login.email')}
            autoComplete="email"
            required
            color={emailError ? 'error' : 'primary'}
          />
        </FormControl>

        {/* password input */}
        <FormControl>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder={t('login.password')}
            type="password"
            id="password"
            autoComplete="current-password"
            required
            color={passwordError ? 'error' : 'primary'}
          />
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          onClick={validateInputs}
          disabled={loading}
        >
          {loading ? t('login.signingIn') : t('login.signIn')}
        </Button>
      </Box>
    </Paper>
  )
}
