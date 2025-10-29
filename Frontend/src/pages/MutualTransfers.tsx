import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION } from '../animations'
import type { FormEvent } from 'react'
import SectionHeader from '../components/SectionHeader'
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
      <SectionHeader
        title="Mutual Transfer Corner"
        subtitle="Connect with colleagues nationwide to exchange posts and locations that suit your needs."
      />

      {error && <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <AnimatePresence>
        {success && (
          <motion.div
            className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.standard }}
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold text-blue-900">Publish Your Listing</h2>
          <p className="text-sm text-gray-600">Share your current posting and the location you wish to move to.</p>
          {!canPublish && (
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
              Please sign in to publish and manage your mutual transfer listings.
            </div>
          )}
          <Input
            label="Post"
            value={form.post}
            onChange={(e) => setForm((prev) => ({ ...prev, post: e.target.value }))}
            required
            disabled={!canPublish || saving}
          />
          <Input
            label="Current Location"
            value={form.currentLocation}
            onChange={(e) => setForm((prev) => ({ ...prev, currentLocation: e.target.value }))}
            required
            disabled={!canPublish || saving}
          />
          <Input
            label="Desired Location"
            value={form.desiredLocation}
            onChange={(e) => setForm((prev) => ({ ...prev, desiredLocation: e.target.value }))}
            required
            disabled={!canPublish || saving}
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
              placeholder="Add optional remarks such as service tenure or exchange conditions."
              disabled={!canPublish || saving}
            />
          </div>
          <Button type="submit" disabled={saving || !canPublish} loading={saving}>
            {saving ? 'Saving...' : 'Publish Listing'}
          </Button>
        </form>

        <div className="space-y-6 lg:col-span-2">
          <form onSubmit={submitSearch} className="space-y-3 rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">Find Matching Candidates</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Input label="Post" value={searchForm.post} onChange={(e) => setSearchForm((prev) => ({ ...prev, post: e.target.value }))} placeholder="e.g. Junior Engineer" />
              <Input label="Current Location" value={searchForm.current} onChange={(e) => setSearchForm((prev) => ({ ...prev, current: e.target.value }))} placeholder="City or unit" />
              <Input label="Desired Location" value={searchForm.desired} onChange={(e) => setSearchForm((prev) => ({ ...prev, desired: e.target.value }))} placeholder="City or unit" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit">Search</Button>
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

          <div className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-900">Available Listings</h3>
              {loading && <Spinner />}
            </div>
            {!loading && list.length === 0 && (
              <p className="text-sm text-gray-600">No listings found. Adjust your filters or publish yours to start the conversation.</p>
            )}
            <div className="space-y-3">
              {list.map((item) => (
                <div key={item.id} className="rounded-md border border-gray-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-semibold text-blue-900">{item.post}</h4>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Current:</span> {item.currentLocation}
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="font-medium">Desired:</span> {item.desiredLocation}
                      </p>
                      {item.availabilityDate && (
                        <p className="text-xs text-gray-500">Available from {item.availabilityDate.split('T')[0]}</p>
                      )}
                      {item.notes && <p className="mt-1 text-sm text-gray-600">{item.notes}</p>}
                      <div className="mt-2 text-xs text-gray-500">
                        {item.ownerDesignation && <span>{item.ownerDesignation}</span>}
                        {item.ownerDivision && <span className={item.ownerDesignation ? 'ml-2' : ''}>{item.ownerDivision}</span>}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      {item.contactName && <p className="font-medium text-blue-900">{item.contactName}</p>}
                      {item.contactEmail && (
                        <p>
                          <a href={`mailto:${item.contactEmail}`} className="text-blue-700 hover:underline">
                            {item.contactEmail}
                          </a>
                        </p>
                      )}
                      {item.contactPhone && <p>{item.contactPhone}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {user && (
            <div className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-900">Your Listings</h3>
                {mineLoading && <Spinner />}
              </div>
              {!mineLoading && mine.length === 0 && (
                <p className="text-sm text-gray-600">You have not published any listings yet.</p>
              )}
              <div className="space-y-3">
                {mine.map((item) => (
                  <div key={item.id} className="rounded-md border border-gray-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-semibold text-blue-900">{item.post}</h4>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Current:</span> {item.currentLocation}
                          <span className="mx-2 text-gray-400">→</span>
                          <span className="font-medium">Desired:</span> {item.desiredLocation}
                        </p>
                        <p className={`text-xs ${item.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {item.isActive ? 'Active' : 'Inactive'} • Updated {item.updatedAt ? item.updatedAt.split('T')[0] : 'recently'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="ghost" onClick={() => toggleActive(item)}>
                          {item.isActive ? 'Mark Inactive' : 'Mark Active'}
                        </Button>
                        <Button type="button" variant="danger" onClick={() => removeListing(item)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {activeMine.length > 1 && (
                <p className="text-xs text-gray-500">Tip: Consider deactivating older listings once you find a match.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
