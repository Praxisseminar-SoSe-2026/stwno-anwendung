import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

/* Build with: https://dev.to/ra1nbow1/building-reliable-protected-routes-with-react-router-v7-1ka0 */
export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  /* Fixes bug, where you get logged out on reload
   * fix based on: https://medium.com/@kumaraditya7125/protected-routes-role-based-access-in-react-with-typescript-b42e2e8ed63f */
  if (loading) return <div>Loading...</div>

  return !user ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    <Outlet />
  )
}
