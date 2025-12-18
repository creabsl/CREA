import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'
import Button from '../components/Button'
import DataTable from '../components/DataTable'
import { format } from 'date-fns'
import { downloadDocument, getDocumentsFeed } from '../services/api'
import type { DocumentFeedItem, DocumentType } from '../types'

const adminSubTabFor = (t: DocumentType) => {
  switch (t) {
    case 'circular':
      return 'circulars'
    case 'manual':
      return 'manuals'
    case 'court-case':
      return 'court-cases'
  }
}

const TABS: { value: DocumentType; label: string; icon: React.ReactNode }[] = [
  {
    value: 'circular',
    label: 'Circulars',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    value: 'manual',
    label: 'Manuals',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    value: 'court-case',
    label: 'Court Cases',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )
  }
]

export default function Documents() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tabFromUrl = searchParams.get('tab') as DocumentType | null
  const [activeTab, setActiveTab] = useState<DocumentType>(tabFromUrl && ['circular', 'manual', 'court-case'].includes(tabFromUrl) ? tabFromUrl : 'circular')
  const [searchQuery, setSearchQuery] = useState('')
  const [documents, setDocuments] = useState<DocumentFeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Fetch documents from API
  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true)
      setError(null)
      try {
        const list = await getDocumentsFeed()
        setDocuments(list)
      } catch (error) {
        console.error('Failed to fetch documents:', error)
        const msg = error instanceof Error ? error.message : 'Failed to fetch documents'
        setError(msg)
        setDocuments([])
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl && ['circular', 'manual', 'court-case'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  usePageTitle('CREA • Documents')

  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return documents.filter(doc => {
      if (doc.type !== activeTab) return false
      if (!q) return true
      return (
        doc.title.toLowerCase().includes(q) ||
        (doc.label || '').toLowerCase().includes(q)
      )
    })
  }, [documents, activeTab, searchQuery])

  const getColumns = (type: DocumentType) => {
    const labelHeader = type === 'circular' ? 'Subject' : type === 'manual' ? 'Category' : 'Status'

    return [
      {
        key: 'title' as keyof DocumentFeedItem,
        header: 'Title',
        render: (row: DocumentFeedItem) => (
          <div className="font-medium text-gray-900">{row.title}</div>
        )
      },
      {
        key: 'uploadedAt' as keyof DocumentFeedItem,
        header: 'Uploaded',
        render: (row: DocumentFeedItem) => row.uploadedAt ? format(new Date(row.uploadedAt), 'MMM d, yyyy') : '-'
      },
      {
        key: 'label' as keyof DocumentFeedItem,
        header: labelHeader,
        render: (row: DocumentFeedItem) => {
          if (type === 'manual') {
            const v = (row.label || 'general')
            return (
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </span>
            )
          }
          return <div className="text-sm text-gray-700">{row.label || '-'}</div>
        }
      },
      {
        key: 'downloadUrl' as keyof DocumentFeedItem,
        header: 'Download',
        render: (row: DocumentFeedItem) => {
          if (row.downloadUrl) {
            const fallbackName = row.fileName || `${row.type}-${row.id}`
            return (
              <button
                onClick={() => downloadDocument(row.downloadUrl as string, fallbackName)}
                className="text-[var(--primary)] hover:text-[var(--accent)] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </button>
            )
          }
          if (row.externalUrl) {
            return (
              <button
                onClick={() => window.open(row.externalUrl as string, '_blank', 'noopener,noreferrer')}
                className="text-[var(--primary)] hover:text-[var(--accent)] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 4h6m0 0v6m0-6L10 14" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10v10a1 1 0 001 1h10" />
                </svg>
                <span>Open Link</span>
              </button>
            )
          }
          return <span className="text-gray-400">No file</span>
        }
      }
    ]
  }

  const getAddButtonText = (type: DocumentType) => {
    switch (type) {
      case 'circular': return 'Upload Circular'
      case 'manual': return 'Upload Manual'
      case 'court-case': return 'Upload Court Case'
    }
  }

  const getTabIcon = (type: DocumentType) => {
    switch (type) {
      case 'circular':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'manual':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      case 'court-case':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Minimalistic Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h1 className="text-xl font-semibold text-[var(--primary)]">Document Repository</h1>
                <p className="text-xs text-gray-600">Circulars, Manuals & Legal Records</p>
              </div>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => navigate(`/admin?tab=documents&subTab=${adminSubTabFor(activeTab)}`)}
                className="text-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                {getAddButtonText(activeTab)}
              </Button>
            )}
          </div>
        </div>

        {/* Compact Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.value
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.value
                  ? 'bg-blue-100 text-[var(--primary)]'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {documents.filter(d => d.type === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar and Add Button */}
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder={`Search ${activeTab === 'circular' ? 'circulars' : activeTab === 'manual' ? 'manuals' : 'court cases'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            />
          </div>
        </div>
      </div>

      {/* Document Content */}
      {error && (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
          <div className="text-sm text-red-700">
            {error}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            If this says 404, restart the backend so `/api/documents` is available. If it says 401, log out/in to refresh your token.
          </div>
        </div>
      )}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-[var(--primary)] border-t-transparent mb-3"></div>
            <p className="text-sm text-gray-500">Loading documents...</p>
          </div>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DataTable
            columns={getColumns(activeTab)}
            data={filteredDocuments}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="inline-flex p-3 bg-gray-100 rounded-lg mb-3">
              <div className="text-gray-400">
                {getTabIcon(activeTab)}
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No Documents Found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery 
                ? `No documents match "${searchQuery}"`
                : `No ${activeTab === 'circular' ? 'circulars' : activeTab === 'manual' ? 'manuals' : 'court cases'} available`
              }
            </p>
            {!searchQuery && isAdmin && (
              <Button onClick={() => navigate(`/admin?tab=documents&subTab=${adminSubTabFor(activeTab)}`)} className="text-sm">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Document
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
