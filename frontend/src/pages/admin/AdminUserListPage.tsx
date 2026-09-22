import { useUsers } from '../../hooks/useUsers.ts'
import {
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import { Link } from 'react-router'

export function AdminUserListPage() {
  const { t } = useTranslation()
  const { users } = useUsers()

  return (
    <Stack spacing={3} style={{ width: '50%', alignSelf: 'center' }}>
      <Typography variant="h1">{t('userList.title')}</Typography>
      <Divider />
      {users.map((user) => (
        <Card key={user.id} variant="outlined">
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Stack direction="row" spacing={1} style={{ alignItems: 'center' }}>
              <Typography>
                {user.first_name} {user.last_name}
              </Typography>
              {user.roles.map((role) => (
                <Chip key={role} label={role} />
              ))}
              <IconButton component={Link} to={`/admin/users/${user.id}`}>
                <EditIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
