import { useNavigate } from 'react-router'

// made with docs [https://reactrouter.com/api/hooks/useNavigate]
export function useLogout() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('access_token')
    navigate('/')
  }

  return { logout }
}
