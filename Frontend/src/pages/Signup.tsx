import { useEffect, useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/auth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Signup() {
  const { requestOtp, verifyOtp } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation() as unknown as { state?: { from?: { pathname?: string } } }
  usePageTitle('CREA • Sign up')

  useEffect(() => {
    if (!sent || resendIn <= 0) return
    const t = setInterval(() => setResendIn(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [sent, resendIn])

  const isValidEmail = (val: string) => /.+@.+\..+/.test(val.trim())

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!sent) {
        if (!isValidEmail(email)) throw new Error('Please enter a valid email address')
        if (!name.trim()) throw new Error('Full Name is required')
        if (!password) throw new Error('Password is required')
        await requestOtp?.(email.trim(), name.trim())
        setSent(true)
        setResendIn(30)
        return
      } else {
        if (!code || code.trim().length !== 6) throw new Error('Enter the 6-digit code')
        await verifyOtp?.(email.trim(), code.trim(), name.trim(), password)
        const to = location?.state?.from?.pathname || '/'
        navigate(to, { replace: true })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign up failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-[var(--primary)]">Create your account</h1>
        {error && <div className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{error}</div>}
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <Input label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
          <Input label="Full Name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your full name" />
          <Input label="Create Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="new-password" />
          {sent && (
            <Input
              label="Enter OTP"
              value={code}
              onChange={(e)=>setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
              placeholder="6-digit code"
              inputMode="numeric"
              maxLength={6}
              hint={
                <div className="flex items-center gap-2">
                  <button type="button" className="text-[var(--primary)] hover:underline" onClick={()=>{ setSent(false); setCode(''); setResendIn(0); }}>Change email</button>
                  <span aria-hidden>•</span>
                  <button type="button" className={`hover:underline ${resendIn>0 ? 'text-gray-400 cursor-not-allowed' : 'text-[var(--primary)]'}`} disabled={resendIn>0 || loading} onClick={async()=>{ if (!loading) { setError(null); await requestOtp?.(email.trim(), name.trim()); setResendIn(30) } }}>{resendIn>0 ? `Resend in ${resendIn}s` : 'Resend code'}</button>
                </div>
              }
            />
          )}
          <Button type="submit" disabled={loading} loading={loading}>
            {loading ? (sent ? 'Verifying...' : 'Sending OTP...') : (sent ? 'Verify & Create Account' : 'Send OTP')}
          </Button>
        </form>
        <div className="mt-3 text-sm text-gray-600">
          Already have an account? <Link className="text-[var(--primary)] underline" to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
