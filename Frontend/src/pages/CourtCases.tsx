import { useEffect, useState } from 'react'
import DataTable, { type Column } from '../components/DataTable'
import { getCourtCases, loadDemoData } from '../services/api'
import type { CourtCase } from '../types'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'

export default function CourtCases() {
  const [rows, setRows] = useState<CourtCase[]>([])
  usePageTitle('CREA • Court Cases')
  useEffect(() => {
    (async () => {
      await loadDemoData()
      const cs = await getCourtCases()
      setRows(cs)
    })()
  }, [])

  const columns: Column<CourtCase>[] = [
    { key: 'caseNumber', header: 'Court Case Number' },
    { key: 'date', header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
    { key: 'subject', header: 'Subject' },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader title="Court Case Details" subtitle="Track and search ongoing or past court cases." />
      <DataTable data={rows} columns={columns} />
    </div>
  )
}
