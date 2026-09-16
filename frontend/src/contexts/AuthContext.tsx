import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getMe } from '../api/user'
import {unauthorized} from "../api/apiFetch.ts";

export type AuthUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  roles: string[]
  dormitory_id: number | null
  flat_number: string | null
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  setUser: (user: AuthUser | null) => void
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
      return
    }

    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('access_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    return unauthorized(() => {
      localStorage.removeItem('access_token')
      sessionStorage.setItem('session_expired', 'true')
      setUser(null)
    })
  }, []);

  const hasRole = (role: string) => user?.roles.includes(role) ?? false

  return (
    <AuthContext.Provider value={{ user, loading, setUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
