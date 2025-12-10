import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import Input from '../components/Input'
import { StaggerContainer, StaggerItem } from '../components/StaggerAnimation'
import { usePageTitle } from '../hooks/usePageTitle'
import { createCircular, createCourtCase, createEvent, createForumTopic, createManual, deleteCircular, deleteCourtCase, deleteEvent, deleteForumTopic, deleteManual, getCirculars, getCourtCases, getEvents, getForumTopics, getManuals, getSuggestions, updateCircular, updateCourtCase, updateEvent, updateForumTopic, updateManual, adminListUsers, adminUpdateUser, notifyStatsChanged } from '../services/api'
import type { Circular, CourtCase, EventItem, ForumTopic, Manual, Suggestion, Division } from '../types'
import { DIVISIONS } from '../types'
import type { MemberUser } from '../services/api'

export default function Admin() {
  usePageTitle('CREA • Admin')
  const [tab, setTab] = useState<'events'|'manuals'|'circulars'|'forum'|'court-cases'|'suggestions'|'members'>('events')
  const [events, setEvents] = useState<EventItem[]>([])
  const [manuals, setManuals] = useState<Manual[]>([])
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [cases, setCases] = useState<CourtCase[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [members, setMembers] = useState<MemberUser[]>([])
  const [memberDivision, setMemberDivision] = useState<Division | ''>('')
  const navigate = useNavigate()

  useEffect(() => {
    getEvents().then(setEvents)
    getManuals().then(setManuals)
    getCirculars().then(setCirculars)
  getForumTopics().then(setTopics)
  getCourtCases().then(setCases)
  getSuggestions().then(setSuggestions)
    // Preload members (all)
    adminListUsers().then(setMembers).catch(()=>{})
  }, [])

  return (
    <div className="space-y-6">
      {/* Hero Header Section */}
      <motion.div
        className="relative rounded-xl bg-gradient-to-br from-[#0d2c54] via-[#19417d] to-[#0a2343] text-white p-8 overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated decorative background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <motion.div 
            className="absolute -top-1/2 -right-1/4 w-[400px] h-[400px] bg-[var(--accent)] rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-1"
              >
                <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded-full text-xs font-bold border border-[var(--accent)]/30 backdrop-blur-sm uppercase tracking-wider">
                  ⚡ Management Center
                </span>
              </motion.div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            </div>
          </div>
          <p className="text-white/90 text-sm max-w-3xl">
            Manage all aspects of the CREA platform including events, manuals, circulars, court cases, forum topics, member data, and suggestions.
          </p>
        </div>
      </motion.div>

      {/* Quick Overview Cards */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StaggerItem>
          <motion.div 
            className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Events
                </h3>
                <button className="text-xs text-[var(--primary)] hover:underline font-medium" onClick={() => navigate('/events')}>View all →</button>
              </div>
              <ul className="space-y-2">
                {events.slice(0,2).map(e => (
                  <li key={e.id}>
                    <button onClick={() => navigate('/events')} className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                      <div className="text-sm font-medium text-gray-800 truncate">{e.title}</div>
                      <div className="text-xs text-gray-600">{new Date(e.date).toLocaleDateString()} • {e.location}</div>
                    </button>
                  </li>
                ))}
                {events.length === 0 && <li className="text-sm text-gray-500 px-3 py-2">No events yet.</li>}
              </ul>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div 
            className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </span>
                  Forum
                </h3>
                <button className="text-xs text-[var(--primary)] hover:underline font-medium" onClick={() => navigate('/forum')}>View all →</button>
              </div>
              <ul className="space-y-2">
                {topics.slice(0,2).map(t => (
                  <li key={t.id}>
                    <button onClick={() => navigate('/forum')} className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                      <div className="text-sm font-medium text-gray-800 truncate">{t.title}</div>
                      <div className="text-xs text-gray-600">{t.replies} replies • {new Date(t.createdAt).toLocaleDateString()}</div>
                    </button>
                  </li>
                ))}
                {topics.length === 0 && <li className="text-sm text-gray-500 px-3 py-2">No topics yet.</li>}
              </ul>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div 
            className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Circulars
                </h3>
                <button className="text-xs text-[var(--primary)] hover:underline font-medium" onClick={() => navigate('/circulars')}>View all →</button>
              </div>
              <ul className="space-y-2">
                {circulars.slice(0,2).map(c => (
                  <li key={c.id}>
                    <button onClick={() => navigate('/circulars')} className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                      <div className="text-sm font-medium text-gray-800 truncate">{c.subject}</div>
                      <div className="text-xs text-gray-600">{c.boardNumber} • {new Date(c.dateOfIssue).toLocaleDateString()}</div>
                    </button>
                  </li>
                ))}
                {circulars.length === 0 && <li className="text-sm text-gray-500 px-3 py-2">No circulars yet.</li>}
              </ul>
            </div>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div 
            className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            whileHover={{ y: -4 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </span>
                  Court Cases
                </h3>
                <button className="text-xs text-[var(--primary)] hover:underline font-medium" onClick={() => navigate('/court-cases')}>View all →</button>
              </div>
              <ul className="space-y-2">
                {cases.slice(0,2).map(cc => (
                  <li key={cc.id}>
                    <button onClick={() => navigate('/court-cases')} className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                      <div className="text-sm font-medium text-gray-800 truncate">{cc.caseNumber}</div>
                      <div className="text-xs text-gray-600">{new Date(cc.date).toLocaleDateString()} • {cc.subject}</div>
                    </button>
                  </li>
                ))}
                {cases.length === 0 && <li className="text-sm text-gray-500 px-3 py-2">No court cases.</li>}
              </ul>
            </div>
          </motion.div>
        </StaggerItem>
      </StaggerContainer>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {(['events','manuals','circulars','forum','court-cases','suggestions','members'] as const).map(k => (
          <motion.button 
            key={k} 
            onClick={()=>setTab(k)} 
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab===k
                ? 'bg-gradient-to-r from-[var(--primary)] to-[#19417d] text-white shadow-lg shadow-[var(--primary)]/30' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {k.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
          </motion.button>
        ))}
      </div>

      {tab==='events' && <EventsAdmin data={events} onChange={setEvents} />}
      {tab==='manuals' && <ManualsAdmin data={manuals} onChange={setManuals} />}
      {tab==='circulars' && <CircularsAdmin data={circulars} onChange={setCirculars} />}
  {tab==='forum' && <ForumAdmin data={topics} onChange={setTopics} />}
  {tab==='court-cases' && <CourtCasesAdmin data={cases} onChange={setCases} />}
  {tab==='suggestions' && <SuggestionsAdmin data={suggestions} />}
  {tab==='members' && <MembersAdmin data={members} onReload={async(div?: Division | '')=>{ const list = await adminListUsers(div? { division: div } : undefined); setMembers(list) }} onUpdate={async (id, patch)=>{ const upd = await adminUpdateUser(id, patch); setMembers(members.map(m=>m.id===id?upd:m)) }} division={memberDivision} onDivisionChange={async(d)=>{ setMemberDivision(d); const list = await adminListUsers(d? { division: d } : undefined); setMembers(list) }} />}
    </div>
  )
}

function MembersAdmin({ data, onReload, onUpdate, division, onDivisionChange }: { data: MemberUser[]; onReload: (div?: Division | '')=>Promise<void> | void; onUpdate: (id: string, patch: Partial<Omit<MemberUser,'id'|'email'>>) => Promise<void> | void; division: Division | ''; onDivisionChange: (d: Division | '') => Promise<void> | void }){
  const navigate = useNavigate()
  const [editing, setEditing] = useState<Record<string, Partial<MemberUser>>>({})
  const [saving, setSaving] = useState(false)

  const setEdit = (id: string, patch: Partial<MemberUser>) => setEditing(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  const hasChanges = Object.keys(editing).length > 0

  const saveAllChanges = async () => {
    if (!hasChanges) return
    setSaving(true)
    try {
      // Save all changes in parallel
      await Promise.all(
        Object.entries(editing).map(([id, patch]) => onUpdate(id, patch))
      )
      setEditing({})
      notifyStatsChanged()
      alert('All changes saved successfully!')
      // Redirect to Dashboard so admin can see updated division-wise counts immediately
      navigate('/')
    } catch (e) {
      alert((e as Error).message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const discardAllChanges = () => {
    if (hasChanges && confirm('Are you sure you want to discard all changes?')) {
      setEditing({})
    }
  }

  return (
    <div className="space-y-5">
      <motion.div 
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filter by Division
            </label>
            <select className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" value={division} onChange={async(e)=>{ await onDivisionChange(e.target.value as Division | ''); }}>
              <option value="">All divisions</option>
              {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <Button onClick={()=> onReload(division)}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </span>
          </Button>
        </div>
      </motion.div>

      {/* Save All Changes Bar */}
      {hasChanges && (
        <motion.div 
          className="rounded-xl border-2 border-[var(--accent)] bg-gradient-to-r from-yellow-50 to-orange-50 p-5 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <span className="text-sm font-bold text-[var(--primary)] block">
                  Unsaved Changes
                </span>
                <span className="text-sm text-gray-700">
                  {Object.keys(editing).length} member{Object.keys(editing).length > 1 ? 's' : ''} modified
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={discardAllChanges} disabled={saving}>
                Discard All
              </Button>
              <Button onClick={saveAllChanges} disabled={saving}>
                {saving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </span>
            Member Management ({data.length} members)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Mobile</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Designation</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Division</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Department</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Membership</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(u => {
              const e = editing[u.id] || {}
              const hasRowChanges = !!editing[u.id]
              return (
                <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${hasRowChanges ? 'bg-yellow-50/50' : ''}`}>
                  <td className="px-4 py-3">
                    <input className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" value={(e.name ?? u.name) as string} onChange={(ev)=> setEdit(u.id, { name: ev.target.value })} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.mobile || '-'}</td>
                  <td className="px-4 py-3">
                    <input className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" value={(e.designation ?? u.designation) as string} onChange={(ev)=> setEdit(u.id, { designation: ev.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <select className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" value={(e.division ?? u.division) as string} onChange={(ev)=> setEdit(u.id, { division: ev.target.value as Division })}>
                      <option value="">Select…</option>
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" value={(e.department ?? u.department) as string} onChange={(ev)=> setEdit(u.id, { department: ev.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <select className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" value={(e.membershipType ?? u.membershipType) as string} onChange={(ev)=> setEdit(u.id, { membershipType: ev.target.value as MemberUser['membershipType'] })}>
                      {['None','Ordinary','Lifetime'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20" value={(e.role ?? u.role) as string} onChange={(ev)=> setEdit(u.id, { role: ev.target.value as 'admin'|'member' })}>
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {hasRowChanges && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--accent)] bg-yellow-100 px-2 py-1 rounded">Modified</span>
                        <button 
                          className="text-xs text-gray-600 hover:text-gray-900 underline font-medium"
                          onClick={()=> setEditing(prev=>{ const n={...prev}; delete n[u.id]; return n })}
                        >
                          Undo
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {data.length===0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={9}>No members found for selected filter.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </motion.div>

      {/* Bottom Save All Changes Bar */}
      {hasChanges && (
        <motion.div 
          className="rounded-xl border-2 border-[var(--accent)] bg-gradient-to-r from-yellow-50 to-orange-50 p-5 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <span className="text-sm font-bold text-[var(--primary)] block">
                  Unsaved Changes
                </span>
                <span className="text-sm text-gray-700">
                  {Object.keys(editing).length} member{Object.keys(editing).length > 1 ? 's' : ''} modified
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={discardAllChanges} disabled={saving}>
                Discard All
              </Button>
              <Button onClick={saveAllChanges} disabled={saving}>
                {saving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function EventsAdmin({ data, onChange }: { data: EventItem[]; onChange: (d: EventItem[])=>void }){
  const [form, setForm] = useState<Omit<EventItem,'id'>>({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
  return (
    <div className="space-y-5">
      <motion.div 
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </span>
          Add New Event
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
            <Input label="Date" type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
            <Input label="Location" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} />
          </div>
          <Input label="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
          <label className="text-sm inline-flex items-center gap-2 font-medium text-gray-700 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" checked={!!form.breaking} onChange={(e)=>setForm({...form, breaking:e.target.checked})}/>
            Mark as Breaking News
          </label>
          <Button onClick={async()=>{ const created = await createEvent(form); onChange([...data, created]); setForm({ title:'', date:'', location:'', description:'', photos:[], breaking:false }) }}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Event
            </span>
          </Button>
        </div>
      </motion.div>
      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Existing Events ({data.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.map(e=> (
            <div key={e.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  {e.title}
                  {e.breaking && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">BREAKING</span>}
                </div>
                <div className="text-sm text-gray-600 mt-1">{e.date} • {e.location}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={async()=>{ const upd = await updateEvent(e.id,{ breaking: !e.breaking }); onChange(data.map(d=>d.id===e.id?upd:d)) }}>Toggle Breaking</Button>
                <Button variant="danger" onClick={async()=>{ await deleteEvent(e.id); onChange(data.filter(d=>d.id!==e.id)) }}>Delete</Button>
              </div>
            </div>
          ))}
          {data.length===0 && <div className="p-8 text-center text-gray-500">No events found. Add your first event above.</div>}
        </div>
      </motion.div>
    </div>
  )
}

function ManualsAdmin({ data, onChange }: { data: Manual[]; onChange: (d: Manual[])=>void }){
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  return (
    <div className="space-y-5">
      <motion.div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </span>
          Add New Manual
        </h3>
        <div className="space-y-4">
          <Input label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="URL (optional)" value={url} onChange={(e)=>setUrl(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File (PDF or Image)</label>
              <input type="file" accept="application/pdf,image/*" className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
              <div className="text-xs text-gray-500 mt-1">Provide either a URL or upload a file.</div>
            </div>
          </div>
          <Button onClick={async()=>{
            const m = await createManual({ title, url, file: file || undefined });
            onChange([...data, m]);
            setTitle(''); setUrl(''); setFile(null);
          }}>Add Manual</Button>
        </div>
      </motion.div>
      <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Existing Manuals ({data.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.map(m=> (
            <div key={m.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{m.title}</div>
                {m.url && <div className="text-sm text-[var(--primary)] mt-1"><a className="underline hover:text-[var(--accent)]" href={m.url} target="_blank" rel="noreferrer">View Document →</a></div>}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={async()=>{ const upd = await updateManual(m.id,{ title: m.title + ' (Updated)' }); onChange(data.map(d=>d.id===m.id?upd:d)) }}>Quick Update</Button>
                <Button variant="danger" onClick={async()=>{ await deleteManual(m.id); onChange(data.filter(d=>d.id!==m.id)) }}>Delete</Button>
              </div>
            </div>
          ))}
          {data.length===0 && <div className="p-8 text-center text-gray-500">No manuals found. Add your first manual above.</div>}
        </div>
      </motion.div>
    </div>
  )
}

function CircularsAdmin({ data, onChange }: { data: Circular[]; onChange: (d: Circular[])=>void }){
  const [boardNumber, setBoardNumber] = useState('')
  const [subject, setSubject] = useState('')
  const [dateOfIssue, setDateOfIssue] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  return (
    <div className="space-y-5">
      <motion.div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </span>
          Add New Circular
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Board Number" value={boardNumber} onChange={(e)=>setBoardNumber(e.target.value)} />
            <Input label="Date of Issue" type="date" value={dateOfIssue} onChange={(e)=>setDateOfIssue(e.target.value)} />
          </div>
          <Input label="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="URL (optional)" value={url} onChange={(e)=>setUrl(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File (PDF or Image)</label>
              <input type="file" accept="application/pdf,image/*" className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
              <div className="text-xs text-gray-500 mt-1">Provide either a URL or upload a file.</div>
            </div>
          </div>
          <Button onClick={async()=>{ const c = await createCircular({ boardNumber, subject, dateOfIssue, url, file: file || undefined }); onChange([...data, c]); setBoardNumber(''); setSubject(''); setDateOfIssue(''); setUrl(''); setFile(null) }}>Add Circular</Button>
        </div>
      </motion.div>
      <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Existing Circulars ({data.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.map(c=> (
            <div key={c.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{c.subject}</div>
                <div className="text-sm text-gray-600 mt-1">{c.boardNumber} • {c.dateOfIssue}</div>
                {c.url && <div className="text-sm text-[var(--primary)] mt-1"><a className="underline hover:text-[var(--accent)]" href={c.url} target="_blank" rel="noreferrer">View Document →</a></div>}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={async()=>{ const upd = await updateCircular(c.id,{ subject: c.subject + ' (Updated)' }); onChange(data.map(d=>d.id===c.id?upd:d)) }}>Quick Update</Button>
                <Button variant="danger" onClick={async()=>{ await deleteCircular(c.id); onChange(data.filter(d=>d.id!==c.id)) }}>Delete</Button>
              </div>
            </div>
          ))}
          {data.length===0 && <div className="p-8 text-center text-gray-500">No circulars found. Add your first circular above.</div>}
        </div>
      </motion.div>
    </div>
  )
}

function ForumAdmin({ data, onChange }: { data: ForumTopic[]; onChange: (d: ForumTopic[])=>void }){
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('Admin')
  return (
    <div className="space-y-5">
      <motion.div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
          </span>
          Add New Forum Topic
        </h3>
        <div className="space-y-4">
          <Input label="Topic Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <Input label="Author" value={author} onChange={(e)=>setAuthor(e.target.value)} />
          <Button onClick={async()=>{ const t = await createForumTopic({ title, author }); onChange([t, ...data]); setTitle('') }}>Add Topic</Button>
        </div>
      </motion.div>
      <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Existing Topics ({data.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.map(t => (
            <div key={t.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{t.title}</div>
                <div className="text-sm text-gray-600 mt-1">By {t.author} • {new Date(t.createdAt).toLocaleDateString()} • {t.replies} replies</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={async()=>{ const upd = await updateForumTopic(t.id,{ title: t.title + ' (Updated)' }); onChange(data.map(d=>d.id===t.id?upd:d)) }}>Quick Update</Button>
                <Button variant="danger" onClick={async()=>{ await deleteForumTopic(t.id); onChange(data.filter(d=>d.id!==t.id)) }}>Delete</Button>
              </div>
            </div>
          ))}
          {data.length===0 && <div className="p-8 text-center text-gray-500">No forum topics found. Add your first topic above.</div>}
        </div>
      </motion.div>
    </div>
  )
}

function CourtCasesAdmin({ data, onChange }: { data: CourtCase[]; onChange: (d: CourtCase[])=>void }){
  const [caseNumber, setCaseNumber] = useState('')
  const [date, setDate] = useState('')
  const [subject, setSubject] = useState('')
  return (
    <div className="space-y-5">
      <motion.div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
          </span>
          Add New Court Case
        </h3>
        <div className="space-y-4">
          <Input label="Case Number" value={caseNumber} onChange={(e)=>setCaseNumber(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Date" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
            <Input label="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
          </div>
          <Button onClick={async()=>{ const cc = await createCourtCase({ caseNumber, date, subject }); onChange([cc, ...data]); setCaseNumber(''); setDate(''); setSubject('') }}>Add Case</Button>
        </div>
      </motion.div>
      <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Existing Court Cases ({data.length})</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.map(c => (
            <div key={c.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{c.caseNumber}</div>
                <div className="text-sm text-gray-600 mt-1">{new Date(c.date).toLocaleDateString()} • {c.subject}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={async()=>{ const upd = await updateCourtCase(c.id,{ subject: c.subject + ' (Updated)' }); onChange(data.map(d=>d.id===c.id?upd:d)) }}>Quick Update</Button>
                <Button variant="danger" onClick={async()=>{ await deleteCourtCase(c.id); onChange(data.filter(d=>d.id!==c.id)) }}>Delete</Button>
              </div>
            </div>
          ))}
          {data.length===0 && <div className="p-8 text-center text-gray-500">No court cases found. Add your first case above.</div>}
        </div>
      </motion.div>
    </div>
  )
}

function SuggestionsAdmin({ data }: { data: Suggestion[] }){
  return (
    <div className="space-y-5">
      <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </span>
            User Suggestions ({data.length})
          </h3>
        </div>
        {data.length===0 && <div className="p-8 text-center text-gray-500">No suggestions submitted yet.</div>}
        <div className="divide-y divide-gray-100">
          {data.map(s => (
            <div key={s.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {new Date(s.createdAt).toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-lg">{s.userName}</div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{s.text}</p>
              {s.fileNames?.length>0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  <span>Attachments: {s.fileNames.join(', ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
      <div className="text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-2">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Note: Files are not uploaded in this mock; only filenames are stored.</span>
      </div>
    </div>
  )
}
