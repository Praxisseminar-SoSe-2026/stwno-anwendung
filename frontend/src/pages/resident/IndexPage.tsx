import { Link } from 'react-router'
import { useHealthCheck } from '../../hooks/useHealthCheck'

export function IndexPage() {
  const healthStatus = useHealthCheck()
  return (
    <div>
      <h1>Startseite</h1>
      <p>
        Das Backend {''}
        {healthStatus === 'loading' && 'lädt.'}
        {healthStatus === 'online' && 'ist erreichbar.'}
        {healthStatus === 'offline' && 'ist nicht erreichbar'}
      </p>
      <Link to="/faq">FAQ</Link>
      <Link to="/waschmaschinen">Waschraum Übersicht</Link>
      <Link to="/reparaturanfrage">Neue Reparaturanfrage</Link>
      <Link to="/gemeinschaftsraum">Gemeinschaftsraum</Link>
    </div>
  )
}
