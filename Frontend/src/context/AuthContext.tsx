import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../services/api'
import { login as apiLogin, logout as apiLogout, register as apiRegister, requestOtp as apiRequestOtp, verifyOtp as apiVerifyOtp } from '../services/api'
import { AuthCtx, type AuthState } from './auth'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('crea:user')
    if (raw) setUser(JSON.parse(raw))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem('crea:user', JSON.stringify(user))
    else localStorage.removeItem('crea:user')
  }, [user])

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    async login(username, password) {
      const u = await apiLogin(username, password)
      setUser(u)
    },
    async logout() {
      await apiLogout()
      setUser(null)
    },
    async register(username, name, password) {
      const u = await apiRegister(username, name, password)
      setUser(u)
    },
    async requestOtp(email: string, name?: string) {
      await apiRequestOtp(email, name)
    },
    async verifyOtp(email: string, code: string, name?: string, password?: string) {
      const u = await apiVerifyOtp(email, code, name, password)
      setUser(u)
    },
  }), [user, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
// useAuth hook moved to context/auth.ts
