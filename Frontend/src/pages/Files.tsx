import { usePageTitle } from '../hooks/usePageTitle'

export default function Files(){
  usePageTitle('CREA • Files')
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[var(--primary)]">Your Files</h1>
      <div className="rounded-md border bg-white p-4 text-gray-600">No files yet (mock).</div>
    </div>
  )
}
