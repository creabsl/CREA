import { useEffect, useState } from 'react'
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

  return (
    <div className="space-y-6">
      <SectionHeader title="Court Case Details" subtitle="Track and search ongoing or past court cases." />
      
      <div className="bg-white rounded-xl shadow-lg border p-6">
        {rows.length > 0 ? (
          <ul className="space-y-3">
            {rows.map(c => (
              <li key={c.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                      <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-lg">{c.caseNumber}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600">
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(c.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                          {c.subject}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {c.url && (
                  <a 
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors text-sm font-medium" 
                    href={c.url} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <p className="text-lg font-medium">No court cases found</p>
            <p className="text-sm mt-1">No court cases available at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}
