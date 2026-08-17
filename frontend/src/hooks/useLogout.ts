import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

// made with docs [https://reactrouter.com/api/hooks/useNavigate]
export function useLogout() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    navigate('/')
  }

  return { logout }
}
