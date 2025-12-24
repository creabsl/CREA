import { createContext, useContext } from 'react'
import type { User } from '../services/api'

export type AuthState = {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (username: string, name: string, password: string) => Promise<void>
  requestOtp?: (email: string, name?: string) => Promise<void>
  verifyOtp?: (email: string, code: string, name?: string, password?: string) => Promise<void>
}

export const AuthCtx = createContext<AuthState | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
