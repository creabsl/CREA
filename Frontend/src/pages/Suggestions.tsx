import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION } from '../animations'
import Button from '../components/Button'
import FileUploader from '../components/FileUploader'
import { submitSuggestion } from '../services/api'
import { useAuth } from '../context/auth'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Suggestions() {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  usePageTitle('CREA • Suggestions')

  const onSubmit = async () => {
    setSaving(true)
    const res = await submitSuggestion({ text, files, userId: user?.id ?? 'anon', userName: user?.name ?? 'Anonymous' })
    if (res.success) { setText(''); setFiles([]); setDone(true) }
    setSaving(false)
  }

  const charCount = text.length
  const maxChars = 1000
  const charPercentage = (charCount / maxChars) * 100

  return (
    <div className="space-y-6">
      {/* Minimalistic Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <h1 className="text-xl font-semibold text-[var(--primary)]">Share Your Ideas</h1>
              <p className="text-xs text-gray-600">Help Us Improve Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {done && (
          <motion.div
            className="rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-lg"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: DURATION.standard }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-900 mb-1">Thank You for Your Feedback!</h3>
                <p className="text-sm text-green-700">Your suggestion has been submitted successfully. We appreciate your contribution to improving our services.</p>
              </div>
              <button 
                onClick={() => setDone(false)}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-0.5">Quick Response</h3>
              <p className="text-xs text-gray-600">We review all suggestions promptly</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-0.5">Confidential</h3>
              <p className="text-xs text-gray-600">Your identity remains private</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-0.5">Impactful</h3>
              <p className="text-xs text-gray-600">Your ideas drive real change</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-lg border bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
          <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h2 className="text-base font-semibold text-[var(--primary)]">Submit Your Suggestion</h2>
        </div>

        <div className="space-y-4">
          {/* Submitter Info */}
          {user && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Submitting as</p>
                  <p className="text-sm text-gray-700">{user.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Textarea */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Your Suggestion *
            </label>
            <textarea 
              value={text} 
              onChange={(e)=>setText(e.target.value)} 
              rows={8} 
              maxLength={maxChars}
              placeholder="Share your ideas for improving the portal features, departmental processes, member services, or any other aspect of CREA operations. Be as detailed as possible..."
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none transition-all duration-200"
            />
            
            {/* Character Counter */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      charPercentage > 90 ? 'bg-red-500' : 
                      charPercentage > 70 ? 'bg-yellow-500' : 
                      'bg-gradient-to-r from-[var(--primary)] to-blue-600'
                    }`}
                    style={{ width: `${charPercentage}%` }}
                  />
                </div>
              </div>
              <div className={`ml-4 text-xs font-medium ${
                charPercentage > 90 ? 'text-red-600' : 
                charPercentage > 70 ? 'text-yellow-600' : 
                'text-gray-600'
              }`}>
                {charCount} / {maxChars}
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attachments (Optional)
            </label>
            <FileUploader onFiles={setFiles} />
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {user 
                  ? 'Your suggestion will be submitted with your identity' 
                  : 'Your suggestion will be submitted anonymously'
                }
              </p>
              <Button 
                onClick={onSubmit} 
                disabled={!text.trim()} 
                loading={saving}
                className="px-8"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Suggestion
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">What kind of suggestions can I share?</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-1">•</span>
                <span>Portal feature improvements and new functionality ideas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-1">•</span>
                <span>Departmental process optimizations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-1">•</span>
                <span>Member service enhancements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-1">•</span>
                <span>Event organization and community engagement ideas</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
