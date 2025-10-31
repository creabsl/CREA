import { useState } from 'react'
import { usePageTitle } from '../hooks/usePageTitle'
import Button from '../components/Button'
import SegmentedControl from '../components/SegmentedControl'
import DataTable from '../components/DataTable'
import FileUploader from '../components/FileUploader'
import Modal from '../components/Modal'
import Input from '../components/Input'
import { format } from 'date-fns'

type DocumentType = 'circular' | 'manual' | 'court-case'

interface Document extends Record<string, unknown> {
  id: string
  title: string
  description: string
  date: string
  type: DocumentType
  fileUrl: string
  fileName: string
  fileSize: string
  uploadedBy: string
  status?: string
  caseNumber?: string
  courtName?: string
  nextHearingDate?: string
  category?: string
  section?: string
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Annual Leave Policy Update',
    description: 'Updated leave policy for the year 2025',
    date: '2025-10-15',
    type: 'circular',
    fileUrl: '#',
    fileName: 'leave-policy-2025.pdf',
    fileSize: '2.1 MB',
    uploadedBy: 'Admin',
    category: 'Policy'
  },
  {
    id: '2',
    title: 'Safety Manual 2025',
    description: 'Comprehensive safety guidelines',
    date: '2025-09-20',
    type: 'manual',
    fileUrl: '#',
    fileName: 'safety-manual.pdf',
    fileSize: '5.3 MB',
    uploadedBy: 'Safety Officer',
    section: 'Safety'
  },
  {
    id: '3',
    title: 'Employee Benefits Case',
    description: 'Case regarding employee benefits',
    date: '2025-08-10',
    type: 'court-case',
    fileUrl: '#',
    fileName: 'case-documents.pdf',
    fileSize: '3.7 MB',
    uploadedBy: 'Legal Team',
    status: 'Ongoing',
    caseNumber: 'CC-2025-123',
    courtName: 'High Court',
    nextHearingDate: '2025-11-15'
  }
]

export default function Documents() {
  const [activeTab, setActiveTab] = useState<DocumentType>('circular')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [documents] = useState<Document[]>(MOCK_DOCUMENTS)

  usePageTitle('CREA • Documents')

  const filteredDocuments = documents.filter(doc => 
    doc.type === activeTab && 
    (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getColumns = (type: DocumentType) => {
    const baseColumns = [
      {
        key: 'title' as keyof Document,
        header: 'Title',
        render: (row: Document) => (
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        )
      },
      {
        key: 'date' as keyof Document,
        header: 'Date',
        render: (row: Document) => format(new Date(row.date), 'MMM d, yyyy')
      },
      {
        key: 'fileUrl' as keyof Document,
        header: 'File',
        render: (row: Document) => (
          <a href={row.fileUrl} className="text-[var(--primary)] hover:text-[var(--accent)] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{row.fileName}</span>
          </a>
        )
      }
    ]

    if (type === 'circular') {
      return [
        ...baseColumns,
        { 
          key: 'category' as keyof Document,
          header: 'Category', 
          render: (row: Document) => row.category 
        }
      ]
    }

    if (type === 'manual') {
      return [
        ...baseColumns,
        { 
          key: 'section' as keyof Document,
          header: 'Section', 
          render: (row: Document) => row.section 
        }
      ]
    }

    if (type === 'court-case') {
      return [
        ...baseColumns,
        { 
          key: 'status' as keyof Document,
          header: 'Status', 
          render: (row: Document) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${row.status === 'Ongoing' ? 'bg-yellow-100 text-yellow-800' : 
                row.status === 'Closed' ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {row.status}
            </span>
          )
        },
        { 
          key: 'caseNumber' as keyof Document,
          header: 'Case Number', 
          render: (row: Document) => row.caseNumber 
        },
        { 
          key: 'nextHearingDate' as keyof Document,
          header: 'Next Hearing', 
          render: (row: Document) => 
            row.nextHearingDate ? format(new Date(row.nextHearingDate), 'MMM d, yyyy') : '-'
        }
      ]
    }

    return baseColumns
  }

  const getAddButtonText = (type: DocumentType) => {
    switch (type) {
      case 'circular': return 'Add Circular'
      case 'manual': return 'Add Manual'
      case 'court-case': return 'Add Court Case'
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

  const getTypeColor = (_type: DocumentType) => {
    // Using dashboard color palette only
    return 'from-[var(--primary)] to-[var(--primary)]'
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold !text-white" style={{ color: 'white' }}>Document Repository</h1>
          </div>
          <p className="text-white/90 text-lg">Access all organization documents, circulars, manuals, and legal records</p>
        </div>
        
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Circulars</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{documents.filter(d => d.type === 'circular').length}</p>
            </div>
            <div className="p-3 bg-[var(--primary)] rounded-xl text-white">
              {getTabIcon('circular')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Manuals</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{documents.filter(d => d.type === 'manual').length}</p>
            </div>
            <div className="p-3 bg-[var(--accent)] rounded-xl text-white">
              {getTabIcon('manual')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--secondary)] mb-1">Court Cases</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{documents.filter(d => d.type === 'court-case').length}</p>
            </div>
            <div className="p-3 bg-[var(--secondary)] rounded-xl text-white">
              {getTabIcon('court-case')}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <SegmentedControl
              value={activeTab}
              onChange={(value) => setActiveTab(value as DocumentType)}
              options={[
                { value: 'circular', label: 'Circulars' },
                { value: 'manual', label: 'Manuals' },
                { value: 'court-case', label: 'Court Cases' }
              ]}
            />
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              />
            </div>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {getAddButtonText(activeTab)}
          </Button>
        </div>

        {/* Document Count Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{filteredDocuments.length}</span>
          <span>document{filteredDocuments.length !== 1 ? 's' : ''} found</span>
        </div>
      </div>

      {/* Enhanced Document Table */}
      {filteredDocuments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <DataTable
            columns={getColumns(activeTab)}
            data={filteredDocuments}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12">
          <div className="text-center">
            <div className={`inline-flex p-4 bg-gradient-to-br ${getTypeColor(activeTab)} rounded-2xl mb-4`}>
              <div className="text-white">
                {getTabIcon(activeTab)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No documents match your search "${searchQuery}"`
                : `No ${activeTab === 'circular' ? 'circulars' : activeTab === 'manual' ? 'manuals' : 'court cases'} available yet`
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add First Document
              </Button>
            )}
          </div>
        </div>
      )}

      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={getAddButtonText(activeTab)}
      >
        <form className="space-y-4">
          <Input label="Title *" placeholder="Enter document title" />
          <Input label="Description" placeholder="Enter document description" />
          
          {activeTab === 'circular' && (
            <Input label="Category" placeholder="Enter document category" />
          )}

          {activeTab === 'manual' && (
            <Input label="Section" placeholder="Enter manual section" />
          )}

          {activeTab === 'court-case' && (
            <>
              <Input label="Case Number *" placeholder="Enter case number" />
              <Input label="Court Name *" placeholder="Enter court name" />
              <Input type="date" label="Next Hearing Date" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-blue-500">
                  <option value="ongoing">Ongoing</option>
                  <option value="closed">Closed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </>
          )}

          <div className="mt-6">
            <FileUploader
              accept=".pdf,.doc,.docx"
              maxFiles={1}
              onFiles={() => {}}
              hint="Upload document (PDF, DOC, DOCX)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button>Save Document</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
