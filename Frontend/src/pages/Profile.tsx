import { useAuth } from '../context/auth'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Profile(){
  const { user } = useAuth()
  usePageTitle('CREA • Profile')
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--primary)]">Profile</h1>
      <div className="rounded-md border bg-white p-4">
        <div className="text-gray-700"><span className="font-medium">Name:</span> {user?.name}</div>
        <div className="text-gray-700"><span className="font-medium">Role:</span> {user?.role}</div>
      </div>
    </div>
  )
}
