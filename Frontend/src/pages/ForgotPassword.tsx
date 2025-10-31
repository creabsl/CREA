import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export default function ForgotPassword() {
  usePageTitle('CREA • Forgot password')
  const [username, setUsername] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // mock: mark as sent
    setSent(true)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-[var(--primary)]">Forgot password</h1>
        {sent ? (
          <div className="mt-3 rounded border bg-green-50 p-3 text-green-700 text-sm">If an account exists for {username}, a reset link has been sent (mock).</div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mt-1">Enter your username and we'll send a reset link (mock).</p>
            <form className="mt-4 space-y-3" onSubmit={onSubmit}>
              <Input label="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
              <Button type="submit">Send reset link</Button>
            </form>
          </>
        )}
        <div className="mt-3 text-sm text-gray-600">
          <Link className="text-[var(--primary)] underline" to="/login">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
