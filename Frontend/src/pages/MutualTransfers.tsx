import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { usePageTitle } from '../hooks/usePageTitle'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/auth'
import { createMutualTransfer, getMutualTransfers, getMyMutualTransfers, updateMutualTransfer, deleteMutualTransfer } from '../services/api'

type Listing = {
  id: string
  post: string
  currentDesignation?: string
  currentDivision?: string
  currentDepartment?: string
  currentLocation: string
  desiredDesignation?: string
  desiredLocation: string
  division?: string
  availabilityDate?: string | null
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
  isActive?: boolean
}


export default function MutualTransfers() {
  usePageTitle('CREA • Mutual Transfer Corner')
  const { user } = useAuth()
  
  const [searchForm, setSearchForm] = useState({ post: '', current: '', desired: '' })
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [myListings, setMyListings] = useState<Listing[]>([])

  // New Request form
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    desiredDesignation: '',
    currentLocation: '',
    desiredLocation: '',
    availabilityDate: '',
    notes: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  })
  const canSubmit = useMemo(() => {
    const desigOk = form.desiredDesignation.trim().length >= 3 && form.desiredDesignation.trim().length <= 80
    const currOk = !!form.currentLocation.trim()
    const desOk = !!form.desiredLocation.trim()
    const emailOk = !form.contactEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)
    const phoneOk = !form.contactPhone || /^\+?\d[\d\s-]{7,}$/.test(form.contactPhone)
    const dateOk = !form.availabilityDate || new Date(form.availabilityDate).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)
    const notesOk = form.notes.length <= 500
    return desigOk && currOk && desOk && emailOk && phoneOk && dateOk && notesOk
  }, [form])

  useEffect(() => {
    // Prefill from user profile if available
    if (user) {
      setForm(f => ({
        ...f,
        contactName: f.contactName || user.name || '',
        contactEmail: f.contactEmail || user.email || '',
        contactPhone: f.contactPhone || user.mobile || ''
      }))
    }
  }, [user])

  const refreshListings = async (params?: { post?: string; current?: string; desired?: string }) => {
    setLoading(true); setError(null)
    try {
      const list = await getMutualTransfers(params)
      const mapped: Listing[] = list.map(l => ({
        id: l.id,
        post: l.post,
        currentDesignation: l.currentDesignation,
        currentDivision: l.currentDivision,
        currentDepartment: l.currentDepartment,
        currentLocation: l.currentLocation,
        desiredDesignation: l.desiredDesignation,
        desiredLocation: l.desiredLocation,
        division: l.ownerDivision,
        availabilityDate: l.availabilityDate || null,
        contactName: l.contactName,
        contactEmail: l.contactEmail,
        contactPhone: l.contactPhone,
        notes: l.notes,
        isActive: l.isActive
      }))
      setFilteredListings(mapped)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refreshListings() }, [])
  useEffect(() => { if (user) refreshMyListings() }, [user])

  const refreshMyListings = async () => {
    try {
      const mine = await getMyMutualTransfers()
      setMyListings(mine.map(l => ({
        id: l.id,
        post: l.post,
        currentDesignation: l.currentDesignation,
        currentDivision: l.currentDivision,
        currentDepartment: l.currentDepartment,
        currentLocation: l.currentLocation,
        desiredDesignation: l.desiredDesignation,
        desiredLocation: l.desiredLocation,
        division: l.ownerDivision,
        availabilityDate: l.availabilityDate || null,
        contactName: l.contactName,
        contactEmail: l.contactEmail,
        contactPhone: l.contactPhone,
        notes: l.notes,
        isActive: l.isActive
      })))
    } catch { /* ignore for now */ }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await refreshListings({ post: searchForm.post, current: searchForm.current, desired: searchForm.desired })
  }

  const handleReset = () => {
    setSearchForm({ post: '', current: '', desired: '' })
    refreshListings()
  }

  const totalListings = filteredListings.length
  const activeListings = filteredListings.filter(l => l.isActive).length

  return (
    <div className="space-y-6">
      {/* Minimalistic Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <div>
              <h1 className="text-xl font-semibold text-[var(--primary)]">Mutual Transfer Corner</h1>
              <p className="text-xs text-gray-600">Connect with colleagues for post and location exchanges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--secondary)] mb-1">Total Listings</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{totalListings}</p>
            </div>
            <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
              <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--secondary)] mb-1">Active Listings</p>
              <p className="text-2xl font-bold text-[var(--accent)]">{activeListings}</p>
            </div>
            <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--secondary)] mb-1">Divisions Covered</p>
              <p className="text-2xl font-bold text-[var(--secondary)]">5</p>
            </div>
            <div className="p-2 bg-[var(--secondary)]/10 rounded-lg">
              <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
          <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--primary)]">Find Matching Opportunities</h2>
            <p className="text-xs text-[var(--secondary)]">Search for suitable transfer candidates across divisions</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Post"
              value={searchForm.post}
              onChange={(e) => setSearchForm({ ...searchForm, post: e.target.value })}
              placeholder="e.g. Junior Engineer"
            />
            <Input
              label="Current Location"
              value={searchForm.current}
              onChange={(e) => setSearchForm({ ...searchForm, current: e.target.value })}
              placeholder="e.g. Mumbai Central"
            />
            <Input
              label="Desired Location"
              value={searchForm.desired}
              onChange={(e) => setSearchForm({ ...searchForm, desired: e.target.value })}
              placeholder="e.g. Pune Division"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-[var(--primary)] hover:bg-[#0a2343]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset
            </Button>
            {loading && <span className="text-sm text-gray-600">Loading…</span>}
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      </motion.div>

      {/* Add New Transfer Request (Members/Admin) */}
      {(user?.role === 'member' || user?.role === 'admin') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              </div>
              <h3 className="text-base font-bold text-[var(--primary)]">Add New Transfer Request</h3>
            </div>
            <Button variant="secondary" onClick={()=> setShowForm(s=>!s)}>{showForm ? 'Hide Form' : 'Show Form'}</Button>
          </div>

          {showForm && (
            <form
              onSubmit={async(e)=>{
                e.preventDefault()
                if (!canSubmit) return alert('Please fix validation errors and try again.')
                try {
                  const payload = {
                    desiredDesignation: form.desiredDesignation.trim(),
                    currentLocation: form.currentLocation.trim(),
                    desiredLocation: form.desiredLocation.trim(),
                    availabilityDate: form.availabilityDate ? form.availabilityDate : null,
                    notes: form.notes.trim() || undefined,
                    contactName: form.contactName.trim() || undefined,
                    contactEmail: form.contactEmail.trim() || undefined,
                    contactPhone: form.contactPhone.trim() || undefined,
                  }
                  await createMutualTransfer(payload)
                  setForm({ desiredDesignation:'', currentLocation:'', desiredLocation:'', availabilityDate:'', notes:'', contactName: user?.name || '', contactEmail: user?.email || '', contactPhone: user?.mobile || '' })
                  alert('Transfer request created successfully!')
                  await refreshListings()
                  await refreshMyListings()
                } catch (e) {
                  alert((e as Error).message || 'Failed to create transfer request')
                }
              }}
              className="space-y-5"
            >
              {/* Current Position Info - Read-only display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-sm font-bold text-blue-900">Your Current Position (from profile)</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Designation:</span>
                    <span className="ml-2 text-blue-900 font-semibold">{user?.designation || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Division:</span>
                    <span className="ml-2 text-blue-900 font-semibold">{user?.division || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Department:</span>
                    <span className="ml-2 text-blue-900 font-semibold">{user?.department || 'Not set'}</span>
                  </div>
                </div>
                {(!user?.designation || !user?.division) && (
                  <p className="text-xs text-blue-700 mt-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Please update your profile with complete position details for better matching
                  </p>
                )}
              </div>

              {/* Transfer Request Details */}
              <div className="space-y-4">
                <div className="border-l-4 border-[var(--primary)] pl-4">
                  <h4 className="text-sm font-bold text-[var(--primary)] mb-1">Transfer Request Details</h4>
                  <p className="text-xs text-gray-600">Specify the position and locations for mutual transfer</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Input 
                      label="Desired Position/Designation *" 
                      value={form.desiredDesignation} 
                      onChange={(e)=> setForm({ ...form, desiredDesignation: e.target.value })} 
                      placeholder="e.g. Junior Engineer, Senior Clerk" 
                    />
                    <p className="text-xs text-gray-500 mt-1">The position you want to transfer to</p>
                  </div>
                  <Input 
                    label="Availability Date" 
                    type="date" 
                    value={form.availabilityDate} 
                    onChange={(e)=> setForm({ ...form, availabilityDate: e.target.value })} 
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Input 
                      label="Current Location *" 
                      value={form.currentLocation} 
                      onChange={(e)=> setForm({ ...form, currentLocation: e.target.value })} 
                      placeholder="e.g. Mumbai Central, Kalyan" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Your current work location</p>
                  </div>
                  <div>
                    <Input 
                      label="Desired Location *" 
                      value={form.desiredLocation} 
                      onChange={(e)=> setForm({ ...form, desiredLocation: e.target.value })} 
                      placeholder="e.g. Pune Division, Nashik" 
                    />
                    <p className="text-xs text-gray-500 mt-1">Where you want to transfer</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (optional)</label>
                  <textarea 
                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" 
                    rows={3} 
                    value={form.notes} 
                    onChange={(e)=> setForm({ ...form, notes: e.target.value })} 
                    placeholder="Any special requirements, preferences, or additional information (max 500 chars)" 
                  />
                  <div className="text-xs text-gray-500 mt-1">{form.notes.length}/500</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="text-sm font-bold text-green-700 mb-1">Contact Information</h4>
                  <p className="text-xs text-gray-600">How others can reach you (auto-filled from your profile)</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <Input label="Contact Name" value={form.contactName} onChange={(e)=> setForm({ ...form, contactName: e.target.value })} />
                  <Input label="Contact Email" type="email" value={form.contactEmail} onChange={(e)=> setForm({ ...form, contactEmail: e.target.value })} />
                  <Input label="Contact Phone" value={form.contactPhone} onChange={(e)=> setForm({ ...form, contactPhone: e.target.value })} placeholder="e.g. +91 98765 43210" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button type="submit" disabled={!canSubmit}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Transfer Request
                </Button>
                {!canSubmit && <span className="text-xs text-red-600">Please fill all required fields (*) correctly.</span>}
              </div>
            </form>
          )}
        </motion.div>
      )}

      {/* My Listings Management */}
      {(user?.role === 'member' || user?.role === 'admin') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-base font-bold text-[var(--primary)]">My Listings</h3>
            </div>
            <Button variant="secondary" onClick={refreshMyListings}>Refresh</Button>
          </div>
          {myListings.length === 0 ? (
            <div className="text-sm text-gray-600">No personal listings yet.</div>
          ) : (
            <div className="space-y-3">
              {myListings.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Current:</span>
                      <span className="text-sm font-semibold text-gray-700">{item.currentDesignation || item.post}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-[var(--primary)] uppercase">Desired:</span>
                      <span className="text-sm font-bold text-[var(--primary)]">{item.desiredDesignation || item.post}</span>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {item.currentLocation} → {item.desiredLocation}
                    </div>
                    <div className="mt-2">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={async()=>{ 
                        try {
                          const upd = await updateMutualTransfer(item.id, { isActive: !item.isActive }); 
                          setMyListings(myListings.map(m => m.id===item.id ? { ...m, isActive: upd.isActive } : m));
                          await refreshListings(); // Refresh public listings too
                        } catch (err) {
                          alert((err as Error).message || 'Failed to update listing');
                        }
                      }}
                    >
                      {item.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={async()=>{ 
                        if (!confirm('Delete this listing?')) return; 
                        try {
                          await deleteMutualTransfer(item.id); 
                          setMyListings(myListings.filter(m=>m.id!==item.id)); 
                          await refreshListings();
                        } catch (err) {
                          alert((err as Error).message || 'Failed to delete listing');
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Listings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
              <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--primary)]">Available Transfer Opportunities</h3>
              <p className="text-xs text-[var(--secondary)]">{filteredListings.length} listings found</p>
            </div>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-base font-semibold text-gray-700 mb-2">No Listings Found</h4>
            <p className="text-xs text-[var(--secondary)] max-w-md mx-auto">
              No transfer opportunities match your search criteria. Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing, idx) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[var(--primary)] transition-all"
              >
                <div className="flex flex-wrap gap-6">
                  {/* Left Section - Main Info */}
                  <div className="flex-1 min-w-[300px]">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        {(listing.currentDesignation || listing.post).substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 font-medium mb-0.5">Current Position:</div>
                          <h4 className="text-base font-bold text-gray-700">{listing.currentDesignation || listing.post}</h4>
                        </div>
                        <div>
                          <div className="text-xs text-[var(--primary)] font-medium mb-0.5">Seeking Position:</div>
                          <h4 className="text-lg font-bold text-[var(--primary)]">{listing.desiredDesignation || listing.post}</h4>
                        </div>
                        {(listing.currentDivision || listing.division) && (
                          <span className="inline-block mt-2 px-2.5 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold rounded-full">
                            {listing.currentDivision || listing.division} Division
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location Transfer */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-[var(--primary)] rounded-lg font-medium text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {listing.currentLocation}
                      </div>
                      <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        {listing.desiredLocation}
                      </div>
                    </div>

                    {/* Availability Date */}
                    <div className="flex items-center gap-2 text-sm text-[var(--secondary)] mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {listing.availabilityDate ? (
                        <span>Available from: <strong className="text-[var(--primary)]">{new Date(listing.availabilityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
                      ) : (
                        <span>Availability: <strong className="text-[var(--primary)]">Flexible</strong></span>
                      )}
                    </div>

                    {/* Notes */}
                    {listing.notes && (
                      <div className="bg-gray-50 border-l-4 border-[var(--accent)] p-3 rounded">
                        <p className="text-sm text-gray-700">{listing.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Contact Info */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-w-[250px]">
                    <p className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wide mb-3">Contact Information</p>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-semibold text-[var(--primary)]">{listing.contactName || '—'}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {listing.contactEmail ? (
                          <a href={`mailto:${listing.contactEmail}`} className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all">
                            {listing.contactEmail}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-700">—</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm text-gray-700">{listing.contactPhone || '—'}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-300">
                      {listing.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Active Listing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
