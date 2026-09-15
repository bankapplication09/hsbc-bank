import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { getCurrentSession, login as apiLogin, logout as apiLogout } from '../lib/api'
import type { AuthSession, UserRole } from '../types'

interface AuthContextValue {
  session: AuthSession | null
  loading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  refresh: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setSession(getCurrentSession())
  }, [])

  useEffect(() => {
    refresh()
    setLoading(false)
    const handler = () => refresh()
    window.addEventListener('velora:data-changed', handler)
    return () => window.removeEventListener('velora:data-changed', handler)
  }, [refresh])

  const login = async (email: string, password: string, role: UserRole) => {
    const result = await apiLogin(email, password, role)
    if (result) {
      setSession(result)
      return true
    }
    return false
  }

  const logout = () => {
    apiLogout()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
