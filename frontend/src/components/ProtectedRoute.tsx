import {Navigate, Outlet, useLocation} from "react-router"
import { useAuth } from '../contexts/AuthContext'

/* Build with: https://dev.to/ra1nbow1/building-reliable-protected-routes-with-react-router-v7-1ka0 */ 
export function ProtectedRoute() {
    const { user } = useAuth()
    const location = useLocation()

    return !user ? (
        <Navigate to="/login" state={{ from: location }} replace />
        ) : (
          <Outlet />
    )
}