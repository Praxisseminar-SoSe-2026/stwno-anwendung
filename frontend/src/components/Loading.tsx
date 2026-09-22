import { CircularProgress, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function Loading() {
  const { t } = useTranslation()
  return (
    <Stack direction="column">
      <CircularProgress />
      <Typography>{t('common.loading')}</Typography>
    </Stack>
  )
}
