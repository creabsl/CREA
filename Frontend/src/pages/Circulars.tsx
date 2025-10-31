import { useEffect, useState } from 'react'
import DataTable, { type Column } from '../components/DataTable'
import { getCirculars } from '../services/api'
import type { Circular } from '../types'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Circulars() {
  const [rows, setRows] = useState<Circular[]>([])
  usePageTitle('CREA • Circulars')
  useEffect(() => { getCirculars().then(setRows) }, [])

  const columns: Column<Circular>[] = [
    { key: 'boardNumber', header: 'Railway Board Number' },
    { key: 'subject', header: 'Subject' },
    { key: 'dateOfIssue', header: 'Date of Issue', render: (r) => new Date(r.dateOfIssue).toLocaleDateString() },
    { key: 'url', header: 'Document', render: (r) => <a className="text-[var(--primary)] underline" href={r.url} target="_blank" rel="noreferrer">View/Download</a> },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader title="Circulars" subtitle="Search and download official circular documents." />
      <DataTable data={rows} columns={columns} />
    </div>
  )
}
