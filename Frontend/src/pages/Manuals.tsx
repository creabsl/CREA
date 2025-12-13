import { useEffect, useState, useMemo } from 'react'
import { getManuals } from '../services/api'
import type { Manual, ManualCategory } from '../types'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Manuals() {
  const [list, setList] = useState<Manual[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ManualCategory | 'all'>('all')
  usePageTitle('CREA • Manuals')
  useEffect(() => { getManuals().then(setList) }, [])

  const filteredList = useMemo(() => {
    if (selectedCategory === 'all') return list
    return list.filter(m => m.category === selectedCategory)
  }, [list, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold !text-white" style={{ color: 'white' }}>Manuals & References</h1>
          </div>
          <p className="text-white/90 text-lg">Access essential manuals and reference documents</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl shadow-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--primary)]">Categories</h2>
          <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold px-2.5 py-1 rounded-full">
            {filteredList.length} {filteredList.length === 1 ? 'Manual' : 'Manuals'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('technical')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'technical'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Technical
          </button>
          <button
            onClick={() => setSelectedCategory('social')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'social'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Social
          </button>
          <button
            onClick={() => setSelectedCategory('organizational')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'organizational'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Organizational
          </button>
          <button
            onClick={() => setSelectedCategory('general')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === 'general'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            General
          </button>
        </div>
      </div>

      {/* Manuals List */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        {filteredList.length > 0 ? (
          <ul className="space-y-3">
            {filteredList.map(m => (
              <li key={m.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">{m.title}</span>
                    {m.category && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                        {m.category.charAt(0).toUpperCase() + m.category.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                <a 
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/90 transition-colors text-sm font-medium" 
                  href={m.url} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">No manuals found</p>
            <p className="text-sm mt-1">No manuals available in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
