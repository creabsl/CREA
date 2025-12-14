import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'
import { bulkUploadMembers, type BulkUploadResponse, type BulkUploadResult } from '../services/api'

interface BulkMemberUploadProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function BulkMemberUpload({ isOpen, onClose, onSuccess }: BulkMemberUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<BulkUploadResponse | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        setResults(null)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
        setResults(null)
      }
    }
  }

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    const validExtensions = ['.csv', '.xls', '.xlsx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      alert('Please upload a valid CSV or Excel file (.csv, .xls, .xlsx)')
      return false
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB')
      return false
    }

    return true
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first')
      return
    }

    setUploading(true)
    setResults(null)

    try {
      const response = await bulkUploadMembers(file)
      setResults(response)
      
      if (response.results.success.length > 0) {
        onSuccess()
      }
    } catch (error: any) {
      alert('Upload failed: ' + (error.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setResults(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[var(--primary)] to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Bulk Member Upload</h2>
                  <p className="text-white/90 text-sm">Upload CSV or Excel file to add multiple members</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Required Columns Format Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Required Column Format</h3>
                  <p className="text-sm text-gray-700">
                    Your CSV or Excel file must have these columns in this exact sequence:
                  </p>
                </div>
              </div>

              {/* Column Table */}
              <div className="bg-white rounded-lg border border-blue-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-100 border-b border-blue-200">
                      <th className="px-4 py-2 text-left font-bold text-gray-700 w-12">#</th>
                      <th className="px-4 py-2 text-left font-bold text-gray-700">Column Name</th>
                      <th className="px-4 py-2 text-left font-bold text-gray-700">Required</th>
                      <th className="px-4 py-2 text-left font-bold text-gray-700">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">1</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">name</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">John Doe</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">2</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">email</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">john.doe@example.com</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">3</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">mobile</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">9876543210</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">4</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">designation</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">Senior Engineer</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">5</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">division</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">Central</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">6</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">department</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">Engineering</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">7</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">type</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">ordinary or lifetime</td>
                    </tr>
                    <tr className="hover:bg-blue-50 bg-gray-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">8</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">purchaseDate</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Recommended
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">2024-01-15 or 01/15/2024</td>
                    </tr>
                    <tr className="hover:bg-blue-50 bg-gray-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">9</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">place</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Optional
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">Mumbai</td>
                    </tr>
                    <tr className="hover:bg-blue-50 bg-gray-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">10</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">unit</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Optional
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">Unit 1</td>
                    </tr>
                    <tr className="hover:bg-blue-50 bg-gray-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">11</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">paymentMethod</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Optional
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">upi, card, netbanking, qr</td>
                    </tr>
                    <tr className="hover:bg-blue-50 bg-gray-50">
                      <td className="px-4 py-2 text-gray-600 font-mono">12</td>
                      <td className="px-4 py-2 font-semibold text-gray-900">paymentAmount</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Optional
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">500 or 5000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Important Notes */}
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">Important Notes:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>First row must contain column headers (exactly as shown above)</li>
                      <li>Column sequence must match the order shown in the table</li>
                      <li>Email addresses must be unique (no duplicates)</li>
                      <li>Type must be either "ordinary" or "lifetime"</li>
                      <li><strong>Purchase Date:</strong> Used to calculate membership validity. If not provided, current date is used</li>
                      <li><strong>Ordinary memberships:</strong> Valid for 1 year from purchase date</li>
                      <li><strong>Lifetime memberships:</strong> No expiry date</li>
                      <li>Optional columns can be left empty or filled with default values</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Upload File
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : file
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv,.xls,.xlsx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {file ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFile(null)
                        setResults(null)
                      }}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Drop your file here</p>
                      <p className="text-sm text-gray-600">or click to browse</p>
                      <p className="text-xs text-gray-500 mt-1">Supported formats: CSV, Excel (.csv, .xls, .xlsx)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.results.total}</div>
                    <div className="text-sm text-gray-600">Total Records</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{results.results.success.length}</div>
                    <div className="text-sm text-gray-600">Successful</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{results.results.failed.length}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                </div>

                {/* Success List */}
                {results.results.success.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Successfully Added Members
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {results.results.success.map((item: BulkUploadResult, idx: number) => (
                        <div key={idx} className="bg-white rounded p-3 text-sm">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{item.name}</span>
                                <span className="text-gray-600">({item.email})</span>
                              </div>
                              {item.validFrom && item.validUntil && (
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium">Valid:</span> {new Date(item.validFrom).toLocaleDateString()} 
                                  {item.validUntil !== '2099-12-31T00:00:00.000Z' && 
                                    ` - ${new Date(item.validUntil).toLocaleDateString()}`
                                  }
                                  {item.validUntil === '2099-12-31T00:00:00.000Z' && 
                                    <span className="ml-1 text-green-600 font-semibold">(Lifetime)</span>
                                  }
                                </div>
                              )}
                            </div>
                            <span className="text-green-600 font-mono text-xs whitespace-nowrap">{item.membershipId}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failed List */}
                {results.results.failed.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Failed Records
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {results.results.failed.map((item: BulkUploadResult, idx: number) => (
                        <div key={idx} className="bg-white rounded p-3 text-sm">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <span className="font-semibold text-gray-900">Row {item.row}</span>
                              <div className="text-red-600 text-xs mt-1">{item.error}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="secondary" onClick={handleClose}>
                {results ? 'Close' : 'Cancel'}
              </Button>
              {!results && (
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload Members
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
