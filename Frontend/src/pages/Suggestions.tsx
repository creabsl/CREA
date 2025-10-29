import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION } from '../animations'
import Button from '../components/Button'
import FileUploader from '../components/FileUploader'
import { submitSuggestion } from '../services/api'
import { useAuth } from '../context/auth'
import SectionHeader from '../components/SectionHeader'
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

  return (
    <div className="space-y-6">
      <SectionHeader title="Suggestions" subtitle="Help us improve the portal and processes." />
      <AnimatePresence>
        {done && (
          <motion.div
            className="rounded-md border border-green-300 bg-green-50 p-3 text-green-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.standard }}
          >
            Thank you! Your suggestion has been submitted.
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-3 rounded-md border bg-white p-4">
        <label className="block text-sm font-medium text-gray-700">Suggestion</label>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={6} placeholder="Share your suggestions to improve the portal or departmental processes." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900"/>
        <div className="text-xs text-gray-500">{text.length} characters</div>
        <div className="pt-2">
          <FileUploader onFiles={setFiles} />
          {files.length>0 && <div className="mt-2 text-xs text-gray-600">{files.length} file(s) attached.</div>}
        </div>
        <div className="pt-2">
          <Button onClick={onSubmit} disabled={!text.trim()} loading={saving}>Submit</Button>
        </div>
      </div>
    </div>
  )
}
