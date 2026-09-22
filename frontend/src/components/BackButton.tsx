import { useNavigate } from 'react-router'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function BackButton() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <Button onClick={() => navigate(-1)} sx={{ marginBottom: 3 }}>
      {t('common.back')}
    </Button>
  )
}
