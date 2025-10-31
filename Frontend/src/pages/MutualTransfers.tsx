import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION } from '../animations'
import type { FormEvent } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'
import {
  createMutualTransfer,
  deleteMutualTransfer,
  getMutualTransfers,
  getMyMutualTransfers,
  updateMutualTransfer,
} from '../services/api'
import type { MutualTransfer } from '../types'

export default function MutualTransfers() {
  usePageTitle('CREA • Mutual Transfer Corner')
  const { user } = useAuth()

  const [searchForm, setSearchForm] = useState({ post: '', current: '', desired: '' })
  const [query, setQuery] = useState(searchForm)
  const [list, setList] = useState<MutualTransfer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [mine, setMine] = useState<MutualTransfer[]>([])
  const [mineLoading, setMineLoading] = useState(false)

  const [form, setForm] = useState({
    post: '',
    currentLocation: '',
    desiredLocation: '',
    availabilityDate: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setForm((prev) => ({
      ...prev,
      contactName: prev.contactName || user.name || '',
    }))
  }, [user])

  const activeMine = useMemo(() => mine.filter((m) => m.isActive), [mine])
  const canPublish = Boolean(user)

  const fetchList = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMutualTransfers({
        post: query.post.trim() || undefined,
        current: query.current.trim() || undefined,
        desired: query.desired.trim() || undefined,
      })
      setList(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load listings'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [query])

  const fetchMine = useCallback(async () => {
    if (!user) {
      setMine([])
      return
    }
    try {
      setMineLoading(true)
      const data = await getMyMutualTransfers()
      setMine(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load your listings'
      setError(message)
    } finally {
      setMineLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  useEffect(() => {
    fetchMine()
  }, [fetchMine])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Please log in to publish a listing.')
      setSuccess(null)
      return
    }
    if (!form.post.trim() || !form.currentLocation.trim() || !form.desiredLocation.trim()) {
      setError('Please fill in the post, current location, and desired location.')
      setSuccess(null)
      return
    }
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      await createMutualTransfer({
        post: form.post.trim(),
        currentLocation: form.currentLocation.trim(),
        desiredLocation: form.desiredLocation.trim(),
        contactName: form.contactName.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
        contactPhone: form.contactPhone.trim() || undefined,
        notes: form.notes.trim() || undefined,
        availabilityDate: form.availabilityDate ? form.availabilityDate : null,
      })
  setSuccess('Listing published successfully.')
      setForm({
        post: '',
        currentLocation: '',
        desiredLocation: '',
        availabilityDate: '',
        contactName: user.name || '',
        contactEmail: '',
        contactPhone: '',
        notes: '',
      })
  fetchList()
      fetchMine()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to create listing'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const submitSearch = (e: FormEvent) => {
    e.preventDefault()
    setQuery({ ...searchForm })
  }

  const toggleActive = async (entry: MutualTransfer) => {
    try {
      await updateMutualTransfer(entry.id, { isActive: !entry.isActive })
      fetchList()
      fetchMine()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to update listing'
      setError(message)
    }
  }

  const removeListing = async (entry: MutualTransfer) => {
    if (typeof window !== 'undefined' && !window.confirm('Remove this listing?')) return
    try {
      await deleteMutualTransfer(entry.id)
      fetchList()
      fetchMine()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to delete listing'
      setError(message)
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-blue-900 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold !text-white" style={{ color: 'white' }}>Mutual Transfer Corner</h1>
          </div>
          <p className="text-blue-100 text-lg">Connect with colleagues nationwide to exchange posts and locations that suit your needs</p>
        </div>
        
        {/* Decorative gradient blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--accent)]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Listings</p>
              <p className="text-3xl font-bold text-blue-900">{list.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Your Active Listings</p>
              <p className="text-3xl font-bold text-green-900">{activeMine.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Total Yours</p>
              <p className="text-3xl font-bold text-purple-900">{mine.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-3"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}
      
      <AnimatePresence>
        {success && (
          <motion.div
            className="rounded-xl border-2 border-green-300 bg-green-50 p-4 text-sm text-green-700 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.standard }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Publish Form */}
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border bg-white p-6 shadow-lg lg:col-span-1">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-2 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--primary)]">Publish Your Listing</h2>
              <p className="text-xs text-gray-500">Share your transfer requirements</p>
            </div>
          </div>
          
          {!canPublish && (
            <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Please sign in to publish and manage your mutual transfer listings.</span>
            </div>
          )}
          
          <Input
            label="Post *"
            value={form.post}
            onChange={(e) => setForm((prev) => ({ ...prev, post: e.target.value }))}
            required
            disabled={!canPublish || saving}
            placeholder="e.g. Junior Engineer"
          />
          <Input
            label="Current Location *"
            value={form.currentLocation}
            onChange={(e) => setForm((prev) => ({ ...prev, currentLocation: e.target.value }))}
            required
            disabled={!canPublish || saving}
            placeholder="e.g. Mumbai Central"
          />
          <Input
            label="Desired Location *"
            value={form.desiredLocation}
            onChange={(e) => setForm((prev) => ({ ...prev, desiredLocation: e.target.value }))}
            required
            disabled={!canPublish || saving}
            placeholder="e.g. Delhi"
          />
          <Input
            label="Availability Date"
            type="date"
            value={form.availabilityDate}
            onChange={(e) => setForm((prev) => ({ ...prev, availabilityDate: e.target.value }))}
            disabled={!canPublish || saving}
          />
          <Input
            label="Contact Name"
            value={form.contactName}
            onChange={(e) => setForm((prev) => ({ ...prev, contactName: e.target.value }))}
            disabled={!canPublish || saving}
          />
          <Input
            label="Contact Email"
            type="email"
            value={form.contactEmail}
            onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
            disabled={!canPublish || saving}
          />
          <Input
            label="Contact Phone"
            value={form.contactPhone}
            onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
            disabled={!canPublish || saving}
          />
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Notes (Optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="h-24 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
              placeholder="Add optional remarks such as service tenure or exchange conditions..."
              disabled={!canPublish || saving}
            />
          </div>
          <Button type="submit" disabled={saving || !canPublish} loading={saving} className="w-full">
            {saving ? 'Publishing...' : 'Publish Listing'}
          </Button>
        </form>

        <div className="space-y-6 lg:col-span-2">
          {/* Search Form */}
          <form onSubmit={submitSearch} className="rounded-2xl border bg-white p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--primary)]">Find Matching Candidates</h2>
                <p className="text-xs text-gray-500">Search for suitable transfer opportunities</p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <Input label="Post" value={searchForm.post} onChange={(e) => setSearchForm((prev) => ({ ...prev, post: e.target.value }))} placeholder="e.g. Junior Engineer" />
              <Input label="Current Location" value={searchForm.current} onChange={(e) => setSearchForm((prev) => ({ ...prev, current: e.target.value }))} placeholder="City or unit" />
              <Input label="Desired Location" value={searchForm.desired} onChange={(e) => setSearchForm((prev) => ({ ...prev, desired: e.target.value }))} placeholder="City or unit" />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearchForm({ post: '', current: '', desired: '' })
                  setQuery({ post: '', current: '', desired: '' })
                }}
              >
                Reset
              </Button>
            </div>
          </form>

          {/* Available Listings */}
          <div className="rounded-2xl border bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--primary)]">Available Listings</h3>
                  <p className="text-xs text-gray-500">{list.length} opportunities found</p>
                </div>
              </div>
              {loading && <Spinner />}
            </div>
            
            {!loading && list.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No Listings Found</h4>
                <p className="text-sm text-gray-500 max-w-md mx-auto">No listings match your search criteria. Try adjusting your filters or publish your own listing to start the conversation.</p>
              </div>
            )}
            
            <div className="space-y-4">
              {list.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl border-2 border-gray-200 p-5 hover:border-[var(--primary)] hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {item.post.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[var(--primary)]">{item.post}</h4>
                          {item.ownerDivision && (
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {item.ownerDivision}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 text-sm">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {item.currentLocation}
                        </span>
                        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          {item.desiredLocation}
                        </span>
                      </div>
                      
                      {item.availabilityDate && (
                        <p className="text-xs text-gray-600 flex items-center gap-1.5 mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Available from <span className="font-semibold">{item.availabilityDate.split('T')[0]}</span>
                        </p>
                      )}
                      
                      {item.notes && (
                        <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border-l-4 border-[var(--primary)]">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border shadow-sm min-w-[200px]">
                      <p className="text-xs text-gray-500 mb-2 font-semibold uppercase">Contact Information</p>
                      {item.contactName && (
                        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)] mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {item.contactName}
                        </p>
                      )}
                      {item.contactEmail && (
                        <p className="mb-2">
                          <a href={`mailto:${item.contactEmail}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {item.contactEmail}
                          </a>
                        </p>
                      )}
                      {item.contactPhone && (
                        <p className="text-sm text-gray-700 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {item.contactPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Your Listings */}
          {user && (
            <div className="rounded-2xl border bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between mb-5 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--primary)]">Your Listings</h3>
                    <p className="text-xs text-gray-500">Manage your transfer requests</p>
                  </div>
                </div>
                {mineLoading && <Spinner />}
              </div>
              
              {!mineLoading && mine.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">No Listings Yet</h4>
                  <p className="text-sm text-gray-500">You haven't published any mutual transfer listings yet. Create one using the form on the left!</p>
                </div>
              )}
              
              <div className="space-y-4">
                {mine.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-xl border-2 p-5 transition-all duration-200 ${
                      item.isActive 
                        ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                        : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="text-lg font-bold text-[var(--primary)]">{item.post}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.isActive 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-400 text-white'
                          }`}>
                            {item.isActive ? '● Active' : '○ Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-semibold">Current:</span> {item.currentLocation}
                          <span className="mx-2 text-[var(--accent)]">→</span>
                          <span className="font-semibold">Desired:</span> {item.desiredLocation}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Updated {item.updatedAt ? item.updatedAt.split('T')[0] : 'recently'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="ghost" onClick={() => toggleActive(item)} className="text-sm">
                          {item.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button type="button" variant="danger" onClick={() => removeListing(item)} className="text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {activeMine.length > 1 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Tip:</span> Consider deactivating older listings once you find a match to help keep the platform organized.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
