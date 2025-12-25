import { useEffect, useState } from 'react'
import { getCirculars } from '../services/api'
import type { Circular } from '../types'
import SectionHeader from '../components/SectionHeader'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Circulars() {
  const [rows, setRows] = useState<Circular[]>([])
  usePageTitle('CREA • Circulars')
  useEffect(() => { getCirculars().then(setRows) }, [])

  return (
    <div className="space-y-6">
      <SectionHeader title="Circulars" subtitle="Search and download official circular documents." />
      
      <div className="bg-white rounded-xl shadow-lg border p-6">
        {rows.length > 0 ? (
          <ul className="space-y-3">
            {rows.map(c => (
              <li key={c.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                      <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold text-lg">{c.boardNumber}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600">
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(c.dateOfIssue).toLocaleDateString()}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">No circulars found</p>
            <p className="text-sm mt-1">No circulars available at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}
