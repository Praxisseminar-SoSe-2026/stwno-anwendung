// made with documentation [https://mui.com/material-ui/react-dialog/]
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

type DialogProps = {
  open: boolean
  onConfirm: () => void
  onClose: () => void
}

export function Confirmation({ open, onConfirm, onClose }: DialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            p: 4,
            gap: 2,
          },
        },
      }}
    >
      <DialogTitle variant={'h4'}>{t('common.confirmation')}</DialogTitle>
      <DialogContent>{t('common.areYouSure')}</DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="error" variant="contained">
          {t('common.delete')}
        </Button>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
}
