import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/auth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

type LocationState = { from?: { pathname?: string } }

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation() as unknown as { state?: LocationState }
  usePageTitle('CREA • Login')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
  if (!username.trim()) throw new Error('Username or Email is required')
  if (!password) throw new Error('Password is required')
  await login(username.trim(), password)
      const to = location?.state?.from?.pathname || '/'
      navigate(to, { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      // If backend says name/password required, prompt for them without losing OTP state
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-[var(--primary)]">Member Login</h1>
        {error && <div className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <Input label="Username / Email" value={username} onChange={(e)=>setUsername(e.target.value)} autoComplete="username" />
          <Input label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="current-password" />
          <Button type="submit" disabled={loading} loading={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <Link className="text-[var(--primary)] underline" to="/forgot-password">Forgot password?</Link>
          <span>
            New here? <Link className="text-[var(--primary)] underline" to="/signup">Create account</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
