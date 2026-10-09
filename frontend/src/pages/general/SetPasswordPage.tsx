import { type SubmitEventHandler, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSetPassword } from '../../hooks/useSetPassword.ts'
import { PRIVACY_POLICY_VERSION } from '../../constants/privacy.ts'

type PrivacySection = { title: string; text: string }

export function SetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { submitSetPassword, loading, error } = useSetPassword()
  const { t } = useTranslation()

  const token = searchParams.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const privacySections = t('registration.privacy_sections', {
    returnObjects: true,
  }) as unknown as PrivacySection[]

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const success = await submitSetPassword({
      token,
      password,
      consent,
      policy_version: PRIVACY_POLICY_VERSION,
    })
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={loading}
                  required
                />
              }
              label={
                <>
                  {t('registration.consent_label')}{' '}
                  <MuiLink
                    component="button"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setPrivacyOpen(true)
                    }}
                  >
                    {t('registration.privacy_link')}
                  </MuiLink>
                </>
              }
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !consent}
            >
              {loading ? t('common.creating') : t('registration.create_account')}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        )}
      </Paper>

      <Dialog
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        scroll="paper"
        maxWidth="sm"
        fullWidth
        aria-labelledby="privacy-dialog-title"
      >
        <DialogTitle id="privacy-dialog-title">
          {t('registration.privacy_title')}
        </DialogTitle>
        <DialogContent dividers>
          {Array.isArray(privacySections) &&
            privacySections.map((section) => (
              <Box key={section.title} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {section.title}
                </Typography>
                <Typography>{section.text}</Typography>
              </Box>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyOpen(false)}>
            {t('registration.privacy_close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}