import { useEffect, useState } from 'react'
import { getManuals } from '../services/api'
import type { Manual } from '../types'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Manuals() {
  const [list, setList] = useState<Manual[]>([])
  usePageTitle('CREA • Manuals')
  useEffect(() => { getManuals().then(setList) }, [])

  return (
    <div className="space-y-6">
      <SectionHeader title="Manuals" subtitle="Download manuals and reference documents." />
      <ul className="space-y-2">
        {list.map(m => (
          <li key={m.id} className="flex items-center justify-between rounded-md border bg-white p-3">
            <span className="text-gray-800">{m.title}</span>
            <a className="text-[var(--primary)] underline" href={m.url} target="_blank" rel="noreferrer">Download</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
