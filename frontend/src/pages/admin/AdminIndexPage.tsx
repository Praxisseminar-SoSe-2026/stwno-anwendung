import { Link } from 'react-router'

export function AdminIndexPage() {
  return (
    <div>
      <h1>Startseite Admin</h1>
      <Link to="/admin/tickets">Ticket Übersicht</Link>
    </div>
  )
}
