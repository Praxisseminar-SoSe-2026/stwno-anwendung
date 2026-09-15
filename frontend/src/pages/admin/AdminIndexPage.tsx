import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import {useHasRole} from "../../hooks/useHasRole.ts";
import {ADMIN_ROLES} from "../../constants/roles.ts";
import {Typography} from "@mui/material";

export function AdminIndexPage() {
  const { t } = useTranslation()

    const canView = useHasRole(ADMIN_ROLES)

    if (!canView) {
    return <Typography>{t('adminTicketOverview.notAuthorized')}</Typography>
  }

  return (
    <div>
      <h1>{t('adminIndex.title')}</h1>
      <Link to="/admin/tickets">{t('adminTicketOverview.titleShort')}</Link>
    </div>
  )
}
