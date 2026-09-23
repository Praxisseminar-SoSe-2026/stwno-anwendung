import { CircularProgress, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function Loading() {
  const { t } = useTranslation()
  return (
    <Stack
      direction="column"
      spacing={3}
      style={{
        minHeight: '75vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
      <Typography>{t('common.loading')}</Typography>
    </Stack>
  )
}
