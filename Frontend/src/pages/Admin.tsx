import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'
import Input from '../components/Input'
import Spinner from '../components/Spinner'
import { StaggerContainer, StaggerItem } from '../components/StaggerAnimation'
import { usePageTitle } from '../hooks/usePageTitle'
import { createCircular, createCourtCase, createEvent, createForumTopic, createManual, deleteCircular, deleteCourtCase, deleteEvent, deleteForumTopic, deleteManual, getCirculars, getCourtCases, getEvents, getForumTopics, getManuals, getSuggestions, deleteSuggestion, updateCircular, updateCourtCase, updateEvent, updateForumTopic, updateManual, adminListUsers, adminUpdateUser, notifyStatsChanged, getSettings, updateMultipleSettings, getMutualTransfers, createMutualTransfer, updateMutualTransfer, deleteMutualTransfer, getBodyMembers, createBodyMember, updateBodyMember, deleteBodyMember } from '../services/api'
import type { Circular, CourtCase, EventItem, ForumTopic, Manual, Suggestion, Division, MutualTransfer, BodyMember } from '../types'
import { DIVISIONS } from '../types'
import type { MemberUser, Setting } from '../services/api'
import { defaultTimelineStops, defaultPastEvents, type TimelineStop, type PastEvent } from '../data/aboutDefaults'

export default function Admin() {
  usePageTitle('CREA • Admin')
  const [tab, setTab] = useState<'events'|'documents'|'forum'|'suggestions'|'members'|'settings'|'about'|'transfers'|'association-body'|'donations'|'breaking-news'>('events')
  const [events, setEvents] = useState<EventItem[]>([])
  const [manuals, setManuals] = useState<Manual[]>([])
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [cases, setCases] = useState<CourtCase[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [members, setMembers] = useState<MemberUser[]>([])
  const [settings, setSettings] = useState<Setting[]>([])
  const [memberDivision, setMemberDivision] = useState<Division | ''>('')
  const [transfers, setTransfers] = useState<MutualTransfer[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error)
    getManuals().then(setManuals).catch(console.error)
    getCirculars().then(setCirculars).catch(console.error)
    getForumTopics().then(setTopics).catch(console.error)
    getCourtCases().then(setCases).catch(console.error)
    getSuggestions().then(setSuggestions).catch(console.error)
    getSettings().then(setSettings).catch(console.error)
    adminListUsers().then(setMembers).catch(console.error)
    getMutualTransfers({ includeInactive: true }).then(setTransfers).catch(console.error)
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
              <h1 className="text-3xl font-bold !text-white">Admin Panel</h1>
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
                <button className="text-xs text-[var(--primary)] hover:underline font-medium" onClick={() => navigate('/documents?tab=circular')}>View all →</button>
              </div>
              <ul className="space-y-2">
                {circulars.slice(0,2).map(c => (
                  <li key={c.id}>
                    <button onClick={() => navigate('/documents?tab=circular')} className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
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
                <button className="text-xs text-[var(--primary)] hover:underline font-medium" onClick={() => navigate('/documents?tab=court-case')}>View all →</button>
              </div>
              <ul className="space-y-2">
                {cases.slice(0,2).map(cc => (
                  <li key={cc.id}>
                    <button onClick={() => navigate('/documents?tab=court-case')} className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
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
        {(['breaking-news','events','documents','forum','suggestions','members','settings','transfers','association-body','donations'] as const).map(k => (
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
            {k === 'settings' ? 'Membership' : k === 'transfers' ? 'Mutual Transfers' : k === 'forum-approval' ? 'Forum Moderation' : k.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
          </motion.button>
        ))}
        <motion.button 
          key={'about'}
          onClick={()=>setTab('about')} 
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            tab==='about'
              ? 'bg-gradient-to-r from-[var(--primary)] to-[#19417d] text-white shadow-lg shadow-[var(--primary)]/30' 
              : 'bg-white text-gray-700 border border-gray-200 hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          About
        </motion.button>
      </div>

      {tab==='breaking-news' && <BreakingNewsAdmin data={events} onChange={setEvents} />}
      {tab==='events' && <EventsAdmin data={events} onChange={setEvents} />}
      {tab==='documents' && <DocumentsAdmin manuals={manuals} circulars={circulars} courtCases={cases} onManualsChange={setManuals} onCircularsChange={setCirculars} onCourtCasesChange={setCases} />}
  {tab==='forum' && <ForumAdmin data={topics} onChange={setTopics} />}
  {tab==='suggestions' && <SuggestionsAdmin data={suggestions} onChange={setSuggestions} />}
  {tab==='members' && <MembersAdmin data={members} onReload={async(div?: Division | '')=>{ const list = await adminListUsers(div? { division: div } : undefined); setMembers(list) }} onUpdate={async (id, patch)=>{ const upd = await adminUpdateUser(id, patch); setMembers(members.map(m=>m.id===id?upd:m)) }} division={memberDivision} onDivisionChange={async(d)=>{ setMemberDivision(d); const list = await adminListUsers(d? { division: d } : undefined); setMembers(list) }} />}
  {tab==='settings' && <SettingsAdmin data={settings} onChange={setSettings} />}
  {tab==='transfers' && <MutualTransfersAdmin data={transfers} onChange={setTransfers} />}
  {tab==='about' && <AboutAdmin />}
  {tab==='association-body' && <AssociationBodyAdmin />}
  {tab==='donations' && <DonationsAdmin />}
    </div>
  )
}

function AboutAdmin(){
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('🎉')
  const [eventTitle, setEventTitle] = useState('')
  const [eventImage, setEventImage] = useState('')

  const [extrasMilestones, setExtrasMilestones] = useState<TimelineStop[]>([])
  const [extrasGallery, setExtrasGallery] = useState<PastEvent[]>([])
  const [removedDefaultMilestones, setRemovedDefaultMilestones] = useState<string[]>([])
  const [removedDefaultGallery, setRemovedDefaultGallery] = useState<number[]>([])
  const [editingDefaultMilestoneKey, setEditingDefaultMilestoneKey] = useState<string | null>(null)
  const [editingDefaultGalleryId, setEditingDefaultGalleryId] = useState<number | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('crea_timeline_milestones')
      const parsed: TimelineStop[] = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed)) setExtrasMilestones(parsed)
    } catch (e) { console.error(e) }
    try {
      const rawGal = localStorage.getItem('crea_past_events')
      const parsedGal: PastEvent[] = rawGal ? JSON.parse(rawGal) : []
      if (Array.isArray(parsedGal)) setExtrasGallery(parsedGal)
    } catch (e) { console.error(e) }
    try {
      const rawRemoved = localStorage.getItem('crea_timeline_removed_defaults')
      const arr: string[] = rawRemoved ? JSON.parse(rawRemoved) : []
      if (Array.isArray(arr)) setRemovedDefaultMilestones(arr)
    } catch (e) { console.error(e) }
    try {
      const rawRemovedGal = localStorage.getItem('crea_past_events_removed_defaults')
      const arrGal: number[] = rawRemovedGal ? JSON.parse(rawRemovedGal) : []
      if (Array.isArray(arrGal)) setRemovedDefaultGallery(arrGal)
    } catch (e) { console.error(e) }
  }, [])

  const saveMilestones = (list: TimelineStop[]) => {
    localStorage.setItem('crea_timeline_milestones', JSON.stringify(list))
    setExtrasMilestones(list)
    try { window.dispatchEvent(new Event('crea_milestones_updated')) } catch (e) { console.error(e) }
  }

  const saveGallery = (list: PastEvent[]) => {
    localStorage.setItem('crea_past_events', JSON.stringify(list))
    setExtrasGallery(list)
    try { window.dispatchEvent(new Event('crea_gallery_updated')) } catch (e) { console.error(e) }
  }

  const saveRemovedMilestones = (keys: string[]) => {
    localStorage.setItem('crea_timeline_removed_defaults', JSON.stringify(keys))
    setRemovedDefaultMilestones(keys)
    try { window.dispatchEvent(new Event('crea_milestones_updated')) } catch (e) { console.error(e) }
  }

  const saveRemovedGallery = (ids: number[]) => {
    localStorage.setItem('crea_past_events_removed_defaults', JSON.stringify(ids))
    setRemovedDefaultGallery(ids)
    try { window.dispatchEvent(new Event('crea_gallery_updated')) } catch (e) { console.error(e) }
  }

  const addOne = () => {
    const y = year.trim()
    const t = title.trim()
    const d = description.trim()
    if (!y || !/^\d{4}$/.test(y)) { alert('Enter a valid 4-digit year'); return }
    if (!t) { alert('Title is required'); return }
    if (!d) { alert('Description is required'); return }
    const next = [...extrasMilestones, { year: y, title: t, description: d, icon: icon || '🎉' }]
    next.sort((a,b)=>parseInt(a.year)-parseInt(b.year))
    saveMilestones(next)
    if (editingDefaultMilestoneKey) {
      // hide the default we are replacing
      const keys = new Set(removedDefaultMilestones)
      keys.add(editingDefaultMilestoneKey)
      saveRemovedMilestones(Array.from(keys))
    }
    setTitle(''); setYear(''); setDescription(''); setIcon('🎉')
    setEditingDefaultMilestoneKey(null)
    alert('Milestone added. Check About page timeline!')
  }

  const removeOne = (key: string) => {
    const next = extrasMilestones.filter(m => `${m.year}|${m.title}` !== key)
    saveMilestones(next)
  }

  const addGalleryItem = () => {
    const t = eventTitle.trim()
    const img = eventImage.trim()
    if (!t) { alert('Event title is required'); return }
    if (!img) { alert('Please upload an image file'); return }
    const id = Date.now()
    const next = [...extrasGallery, { id, title: t, type: 'photo' as const, thumbnail: img, description: '', date: new Date().toLocaleDateString() }]
    saveGallery(next)
    if (editingDefaultGalleryId != null) {
      const ids = new Set(removedDefaultGallery)
      ids.add(editingDefaultGalleryId)
      saveRemovedGallery(Array.from(ids))
    }
    setEventTitle(''); setEventImage('')
    setEditingDefaultGalleryId(null)
    alert('Event added. Check About page gallery!')
  }

  const removeGalleryItem = (id: number) => {
    const next = extrasGallery.filter(g=> g.id!==id)
    saveGallery(next)
  }

  // Derived combined lists (defaults + extras). Defaults are non-removable.
  const defaultMilestoneKeys = useMemo(() => new Set(defaultTimelineStops.map(m => `${m.year}|${m.title}`)), [])
  const removedMilestonesSet = useMemo(() => new Set(removedDefaultMilestones), [removedDefaultMilestones])
  const combinedMilestones = useMemo(() => {
    const defaultsFiltered = defaultTimelineStops.filter(m => !removedMilestonesSet.has(`${m.year}|${m.title}`))
    const merged = [...defaultsFiltered, ...extrasMilestones]
    return merged.sort((a,b)=> parseInt(a.year) - parseInt(b.year))
  }, [extrasMilestones, removedMilestonesSet])

  const defaultGalleryIds = useMemo(() => new Set(defaultPastEvents.map(g => g.id)), [])
  const removedGallerySet = useMemo(() => new Set(removedDefaultGallery), [removedDefaultGallery])
  const combinedGallery = useMemo(() => {
    const defaultsFiltered = defaultPastEvents.filter(g => !removedGallerySet.has(g.id))
    return [...defaultsFiltered, ...extrasGallery]
  }, [extrasGallery, removedGallerySet])

  return (
    <motion.div 
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <span className="text-amber-600">🚂</span>
          </span>
          About Page Management
        </h3>
        <Button onClick={()=>{ setTitle(''); setYear(''); setDescription(''); setIcon('🎉') }}>Reset Form</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Title</label>
              <Input value={title} onChange={(e)=> setTitle(e.target.value)} placeholder="e.g. Formation of CREA" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <Input value={year} onChange={(e)=> setYear(e.target.value.replace(/[^0-9]/g,''))} placeholder="e.g. 2025" maxLength={4} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                <Input value={icon} onChange={(e)=> setIcon(e.target.value)} placeholder="e.g. 🚂" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">One-line Description</label>
              <textarea value={description} onChange={(e)=> setDescription(e.target.value)} className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" rows={3} placeholder="Brief description" />
            </div>
            <div className="flex gap-2">
              <Button onClick={addOne}>Add Milestone</Button>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">Existing Milestones ({combinedMilestones.length})</h4>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={()=> saveMilestones([])}>Clear Added</Button>
                <Button variant="secondary" onClick={()=> saveRemovedMilestones([])}>Restore Defaults</Button>
              </div>
            </div>
            <ul className="divide-y divide-gray-100 mt-3">
              {combinedMilestones.map((m, idx)=> {
                const key = `${m.year}|${m.title}`
                const isDefault = defaultMilestoneKeys.has(key)
                return (
                  <li key={`${key}-${idx}`} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{m.title} <span className="text-gray-500">• {m.year}</span></div>
                      <div className="text-xs text-gray-600">{m.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{m.icon}</span>
                      {isDefault ? (
                        <>
                          <Button variant="secondary" onClick={()=>{ setTitle(m.title); setYear(m.year); setDescription(m.description); setIcon(m.icon); setEditingDefaultMilestoneKey(key) }}>Edit</Button>
                          <Button variant="danger" onClick={()=>{ const keys = new Set(removedDefaultMilestones); keys.add(key); saveRemovedMilestones(Array.from(keys)) }}>Remove</Button>
                        </>
                      ) : (
                        <Button variant="secondary" onClick={()=> removeOne(key)}>Remove</Button>
                      )}
                    </div>
                  </li>
                )
              })}
              {combinedMilestones.length===0 && <li className="py-6 text-sm text-gray-500 text-center">No milestones yet.</li>}
            </ul>
            {editingDefaultMilestoneKey && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
                Replacing default milestone. Saving will hide the original.
                <button className="ml-2 underline" onClick={()=> setEditingDefaultMilestoneKey(null)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">📷</span>
            </span>
            Past Events Gallery
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={()=> saveGallery([])}>Clear Added</Button>
            <Button variant="secondary" onClick={()=> saveRemovedGallery([])}>Restore Defaults</Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <Input value={eventTitle} onChange={(e)=> setEventTitle(e.target.value)} placeholder="e.g. Engineers Day Celebration" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--primary)] text-white text-sm cursor-pointer hover:opacity-90">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l2-2a2 2 0 012-2h3l2-2h2a2 2 0 012 2v4"/></svg>
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e)=>{
                        const file = e.target.files?.[0]
                        if (!file) { setEventImage(''); return }
                        if (!file.type.startsWith('image/')) { alert('Please select an image file'); return }
                        const reader = new FileReader()
                        reader.onload = () => {
                          const dataUrl = reader.result as string
                          setEventImage(dataUrl)
                        }
                        reader.onerror = () => alert('Failed to read image file')
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  {eventImage && (
                    <div className="flex items-center gap-2">
                      <img src={eventImage} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                      <button type="button" className="text-xs text-red-600" onClick={()=> setEventImage('')}>Remove</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addGalleryItem}>Add Photo</Button>
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-lg border border-gray-200 p-3">
              <h4 className="font-semibold text-gray-800">Existing Photos ({combinedGallery.length})</h4>
              <ul className="divide-y divide-gray-100 mt-3">
                {combinedGallery.map(item => {
                  const isDefault = defaultGalleryIds.has(item.id)
                  return (
                    <li key={item.id} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.thumbnail} alt={item.title} className="w-14 h-14 object-cover rounded" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">{item.title}</div>
                          <div className="text-xs text-gray-600">{item.type}</div>
                        </div>
                      </div>
                      {isDefault ? (
                        <>
                          <Button variant="secondary" onClick={()=>{ setEventTitle(item.title); setEventImage(''); setEditingDefaultGalleryId(item.id) }}>Edit</Button>
                          <Button variant="danger" onClick={()=>{ const ids = new Set(removedDefaultGallery); ids.add(item.id); saveRemovedGallery(Array.from(ids)) }}>Remove</Button>
                        </>
                      ) : (
                        <Button variant="secondary" onClick={()=> removeGalleryItem(item.id)}>Remove</Button>
                      )}
                    </li>
                  )
                })}
                {combinedGallery.length===0 && <li className="py-6 text-sm text-gray-500 text-center">No photos yet.</li>}
              </ul>
              {editingDefaultGalleryId!=null && (
                <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
                  Replacing default photo. Saving will hide the original.
                  <button className="ml-2 underline" onClick={()=> setEditingDefaultGalleryId(null)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
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
          <Button variant="secondary" onClick={()=> {
            const csvData = [
              ['Name', 'Email', 'Mobile', 'Designation', 'Division', 'Department', 'Membership Type', 'Member ID', 'Role'].join(','),
              ...data.map(m => [
                m.name || '',
                m.email || '',
                m.mobile || '',
                m.designation || '',
                m.division || '',
                m.department || '',
                m.membershipType || 'None',
                m.memberId || '',
                m.role || 'member'
              ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
            ].join('\n')
            
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', `members_${division || 'all'}_${new Date().toISOString().split('T')[0]}.csv`)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
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
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Member ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
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
                    {(() => {
                      const membershipType = (e.membershipType ?? u.membershipType) as string
                      const needsNewId = membershipType !== 'None' && (
                        !u.memberId || 
                        (membershipType === 'Lifetime' && u.memberId.startsWith('ORD-')) ||
                        (membershipType === 'Ordinary' && u.memberId.startsWith('LIF-'))
                      )
                      
                      if (u.memberId && !needsNewId) {
                        return <span className="text-sm font-bold text-[var(--primary)]">{u.memberId}</span>
                      } else if (needsNewId) {
                        return (
                          <button 
                            onClick={async () => {
                              const currentDbType = u.membershipType
                              const targetType = membershipType
                              const currentId = u.memberId
                              
                              const action = currentId ? `Upgrade ${u.name} from ${currentId} to ${targetType} membership` : `Generate ${targetType} Member ID for ${u.name}`
                              
                              if (confirm(`${action}?\n\nThis will ${currentId ? 'invalidate the old ID and generate a new one' : 'create a new Member ID'}.`)) {
                                try {
                                  // If membership type has changed in editing state, save it first
                                  if (e.membershipType && e.membershipType !== currentDbType) {
                                    await onUpdate(u.id, { membershipType: e.membershipType })
                                    await new Promise(resolve => setTimeout(resolve, 500))
                                  }
                                  
                                  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/${u.id}/generate-member-id`, {
                                    method: 'POST',
                                    headers: {
                                      'Authorization': `Bearer ${localStorage.getItem('crea:token')}`,
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ membershipType: targetType })
                                  })
                                  
                                  const data = await res.json()
                                  
                                  if (res.ok && data.success) {
                                    const message = data.isUpgrade 
                                      ? `✅ Member ID upgraded successfully!\n\nOld ID: ${data.oldMemberId} (no longer valid)\nNew ID: ${data.memberId}\nType: ${data.membershipType}`
                                      : `✅ Member ID generated successfully!\n\nNew ID: ${data.memberId}\nType: ${data.membershipType}`
                                    alert(message)
                                    onReload(division)
                                  } else {
                                    alert(data.message || 'Failed to generate Member ID')
                                  }
                                } catch (err) {
                                  console.error('Generate Member ID error:', err)
                                  alert('Error: ' + (err as Error).message)
                                }
                              }
                            }}
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap"
                          >
                            {u.memberId ? 'Upgrade ID' : 'Generate ID'}
                          </button>
                        )
                      } else {
                        return <span className="text-xs text-gray-400">No membership</span>
                      }
                    })()}
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

function BreakingNewsAdmin({ data, onChange }: { data: EventItem[]; onChange: (d: EventItem[])=>void }) {
  const [form, setForm] = useState({ title: '', description: '' })
  const [deleting, setDeleting] = useState<string | null>(null)
  
  const breakingNews = data.filter(e => e.breaking)

  const publishBreakingNews = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert('Please fill in both title and message')
      return
    }
    
    try {
      const created = await createEvent({
        title: form.title,
        date: new Date().toISOString().split('T')[0],
        location: 'Announcement',
        description: form.description,
        photos: [],
        breaking: true
      })
      onChange([...data, created])
      setForm({ title: '', description: '' })
      alert('Breaking news published successfully!')
    } catch (error) {
      console.error('Error publishing breaking news:', error)
      alert('Failed to publish breaking news')
    }
  }

  const removeBreakingNews = async (id: string) => {
    if (!confirm('Are you sure you want to remove this breaking news?')) return
    
    setDeleting(id)
    try {
      await deleteEvent(id)
      onChange(data.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error deleting breaking news:', error)
      alert('Failed to delete breaking news')
    } finally {
      setDeleting(null)
    }
  }

  const toggleBreaking = async (event: EventItem) => {
    try {
      const updated = await updateEvent(event.id, { breaking: !event.breaking })
      onChange(data.map(e => e.id === event.id ? updated : e))
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="rounded-xl border-2 border-[var(--accent)] bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--primary)]">Breaking News Management</h2>
            <p className="text-sm text-gray-600">Publish and manage urgent announcements and breaking news</p>
          </div>
        </div>

        {/* Quick Publish Form */}
        <div className="bg-white rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[var(--primary)] text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
              Quick Publish
            </span>
            <span className="text-xs text-gray-600">Appears immediately on dashboard</span>
          </div>
          
          <Input
            label="Breaking News Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., Important Notice, Urgent Update, Alert"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter your breaking news message here..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
            />
          </div>
          
          <Button
            onClick={publishBreakingNews}
            className="w-full bg-[var(--accent)] hover:bg-[#d49500] text-[var(--text-dark)]"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Publish Breaking News
            </span>
          </Button>
        </div>
      </motion.div>

      {/* Active Breaking News List */}
      <motion.div
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">Active Breaking News</h3>
            <span className="bg-[var(--primary)] text-white px-2 py-1 rounded-full text-xs font-bold">
              {breakingNews.length}
            </span>
          </div>
          {breakingNews.length > 0 && (
            <span className="text-xs text-gray-500">Auto-rotates every 5 seconds on dashboard</span>
          )}
        </div>

        {breakingNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No breaking news published</p>
            <p className="text-sm text-gray-400 mt-1">Use the form above to publish urgent announcements</p>
          </div>
        ) : (
          <div className="space-y-3">
            {breakingNews.map((item, index) => (
              <motion.div
                key={item.id}
                className="border-l-4 border-[var(--accent)] bg-gradient-to-r from-yellow-50 to-white rounded-lg p-4 hover:shadow-md transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-[var(--primary)]">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-base">{item.title}</h4>
                      <span className="flex-shrink-0 text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeBreakingNews(item.id)}
                    disabled={deleting === item.id}
                    className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    {deleting === item.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Regular Events that can be promoted to Breaking News */}
      <motion.div
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Promote Events to Breaking News</h3>
        <p className="text-sm text-gray-600 mb-4">Toggle existing events as breaking news</p>
        
        {data.filter(e => !e.breaking).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>All events are already marked as breaking news</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.filter(e => !e.breaking).slice(0, 10).map(event => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{event.title}</h4>
                  <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => toggleBreaking(event)}
                  className="ml-3 px-3 py-1.5 bg-[var(--accent)] hover:bg-[#d49500] text-[var(--text-dark)] rounded-lg text-xs font-medium transition-colors"
                >
                  Make Breaking
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function EventsAdmin({ data, onChange }: { data: EventItem[]; onChange: (d: EventItem[])=>void }){
  const [form, setForm] = useState<Omit<EventItem,'id'>>({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = data.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.date.includes(searchQuery)
  )

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    if (selected.size === filteredEvents.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredEvents.map(e => e.id)))
    }
  }

  const deleteSelected = async () => {
    if (selected.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selected.size} selected event(s)?`)) return
    
    setDeleting(true)
    try {
      await Promise.all(Array.from(selected).map(id => deleteEvent(id)))
      onChange(data.filter(e => !selected.has(e.id)))
      setSelected(new Set())
    } catch (error) {
      alert('Error deleting events')
    } finally {
      setDeleting(false)
    }
  }

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
          <div className="flex items-center justify-between gap-4">
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
        </div>
      </motion.div>
      <motion.div 
        className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {data.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search events by title, location, description, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Existing Events ({filteredEvents.length}{searchQuery && ` of ${data.length}`})</h3>
            <div className="flex items-center gap-3">
              {selectMode ? (
                <>
                  {data.length > 0 && (
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                      <input
                        type="checkbox"
                        checked={selected.size === data.length && data.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      Select All
                    </label>
                  )}
                  {selected.size > 0 && (
                    <Button variant="danger" onClick={deleteSelected} disabled={deleting}>
                      {deleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</Button>
                </>
              ) : (
                filteredEvents.length > 0 && <Button variant="secondary" onClick={() => setSelectMode(true)}>Select</Button>
              )}
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredEvents.map(e=> (
            <div key={e.id} className={`p-5 flex items-center gap-4 transition-colors ${selected.has(e.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.has(e.id)}
                  onChange={() => toggleSelect(e.id)}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800 flex items-center gap-2">
                  {e.title}
                  {e.breaking && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">BREAKING</span>}
                </div>
                <div className="text-sm text-gray-600 mt-1">{e.date} • {e.location}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={async()=>{ const upd = await updateEvent(e.id,{ breaking: !e.breaking }); onChange(data.map(d=>d.id===e.id?upd:d)) }}>Toggle Breaking</Button>
              </div>
            </div>
          ))}
          {data.length === 0 && <div className="p-8 text-center text-gray-500">No events found. Add your first event above.</div>}
          {data.length > 0 && filteredEvents.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No events match your search. <button onClick={() => setSearchQuery('')} className="text-[var(--primary)] underline hover:text-[var(--accent)]">Clear search</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ==================== UNIFIED DOCUMENTS ADMIN ====================
type DocumentSubTab = 'circulars' | 'manuals' | 'court-cases'

function DocumentsAdmin({ 
  manuals, 
  circulars, 
  courtCases, 
  onManualsChange, 
  onCircularsChange, 
  onCourtCasesChange 
}: { 
  manuals: Manual[]
  circulars: Circular[]
  courtCases: CourtCase[]
  onManualsChange: (d: Manual[]) => void
  onCircularsChange: (d: Circular[]) => void
  onCourtCasesChange: (d: CourtCase[]) => void
}) {
  const [subTab, setSubTab] = useState<DocumentSubTab>('circulars')

  // Select mode state
  const [selectModeCirculars, setSelectModeCirculars] = useState(false)
  const [selectedCirculars, setSelectedCirculars] = useState<Set<string>>(new Set())
  const [deletingCirculars, setDeletingCirculars] = useState(false)

  const [selectModeManuals, setSelectModeManuals] = useState(false)
  const [selectedManuals, setSelectedManuals] = useState<Set<string>>(new Set())
  const [deletingManuals, setDeletingManuals] = useState(false)

  const [selectModeCases, setSelectModeCases] = useState(false)
  const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set())
  const [deletingCases, setDeletingCases] = useState(false)

  // Search states
  const [searchQueryCirculars, setSearchQueryCirculars] = useState('')
  const [searchQueryManuals, setSearchQueryManuals] = useState('')
  const [searchQueryCases, setSearchQueryCases] = useState('')

  // Filtered data
  const filteredCirculars = circulars.filter(c => 
    c.subject.toLowerCase().includes(searchQueryCirculars.toLowerCase()) ||
    c.boardNumber.toLowerCase().includes(searchQueryCirculars.toLowerCase()) ||
    c.dateOfIssue.includes(searchQueryCirculars)
  )

  const filteredManuals = manuals.filter(m => 
    m.title.toLowerCase().includes(searchQueryManuals.toLowerCase())
  )

  const filteredCases = courtCases.filter(c => 
    c.caseNumber.toLowerCase().includes(searchQueryCases.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQueryCases.toLowerCase()) ||
    c.date.includes(searchQueryCases)
  )

  // Circular state
  const [circularBoardNumber, setCircularBoardNumber] = useState('')
  const [circularSubject, setCircularSubject] = useState('')
  const [circularDateOfIssue, setCircularDateOfIssue] = useState('')
  const [circularUrl, setCircularUrl] = useState('')
  const [circularFile, setCircularFile] = useState<File | null>(null)
  const [editingCircular, setEditingCircular] = useState<Circular | null>(null)

  // Manual state
  const [manualTitle, setManualTitle] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [manualFile, setManualFile] = useState<File | null>(null)
  const [manualCategory, setManualCategory] = useState<'technical' | 'social' | 'organizational' | 'general'>('general')
  const [editingManual, setEditingManual] = useState<Manual | null>(null)

  // Court case state
  const [caseCaseNumber, setCaseCaseNumber] = useState('')
  const [caseDate, setCaseDate] = useState('')
  const [caseSubject, setCaseSubject] = useState('')
  const [editingCourtCase, setEditingCourtCase] = useState<CourtCase | null>(null)

  const resetCircularForm = () => {
    setCircularBoardNumber('')
    setCircularSubject('')
    setCircularDateOfIssue('')
    setCircularUrl('')
    setCircularFile(null)
    setEditingCircular(null)
  }

  const resetManualForm = () => {
    setManualTitle('')
    setManualUrl('')
    setManualFile(null)
    setManualCategory('general')
    setEditingManual(null)
  }

  const resetCourtCaseForm = () => {
    setCaseCaseNumber('')
    setCaseDate('')
    setCaseSubject('')
    setEditingCourtCase(null)
  }

  const handleEditCircular = (c: Circular) => {
    setCircularBoardNumber(c.boardNumber)
    setCircularSubject(c.subject)
    setCircularDateOfIssue(c.dateOfIssue)
    setCircularUrl(c.url || '')
    setCircularFile(null)
    setEditingCircular(c)
  }

  const handleEditManual = (m: Manual) => {
    setManualTitle(m.title)
    setManualUrl(m.url || '')
    setManualFile(null)
    setManualCategory(m.category || 'general')
    setEditingManual(m)
  }

  const handleEditCourtCase = (cc: CourtCase) => {
    setCaseCaseNumber(cc.caseNumber)
    setCaseDate(cc.date)
    setCaseSubject(cc.subject)
    setEditingCourtCase(cc)
  }

  const handleSaveCircular = async () => {
    if (editingCircular) {
      const upd = await updateCircular(editingCircular.id, { 
        boardNumber: circularBoardNumber, 
        subject: circularSubject, 
        dateOfIssue: circularDateOfIssue,
        url: circularUrl || undefined,
        file: circularFile || undefined
      })
      onCircularsChange(circulars.map(d => d.id === editingCircular.id ? upd : d))
      resetCircularForm()
    } else {
      const c = await createCircular({ 
        boardNumber: circularBoardNumber, 
        subject: circularSubject, 
        dateOfIssue: circularDateOfIssue, 
        url: circularUrl || undefined, 
        file: circularFile || undefined 
      })
      onCircularsChange([...circulars, c])
      resetCircularForm()
    }
  }

  const handleSaveManual = async () => {
    if (editingManual) {
      const upd = await updateManual(editingManual.id, { 
        title: manualTitle, 
        url: manualUrl || undefined,
        file: manualFile || undefined,
        category: manualCategory
      })
      onManualsChange(manuals.map(d => d.id === editingManual.id ? upd : d))
      resetManualForm()
    } else {
      const m = await createManual({ 
        title: manualTitle, 
        url: manualUrl || undefined, 
        file: manualFile || undefined,
        category: manualCategory
      })
      onManualsChange([...manuals, m])
      resetManualForm()
    }
  }

  const handleSaveCourtCase = async () => {
    if (editingCourtCase) {
      const upd = await updateCourtCase(editingCourtCase.id, { 
        caseNumber: caseCaseNumber, 
        date: caseDate, 
        subject: caseSubject 
      })
      onCourtCasesChange(courtCases.map(d => d.id === editingCourtCase.id ? upd : d))
      resetCourtCaseForm()
    } else {
      const cc = await createCourtCase({ 
        caseNumber: caseCaseNumber, 
        date: caseDate, 
        subject: caseSubject 
      })
      onCourtCasesChange([cc, ...courtCases])
      resetCourtCaseForm()
    }
  }

  // Circulars select functions
  const toggleSelectCircular = (id: string) => {
    const newSet = new Set(selectedCirculars)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedCirculars(newSet)
  }

  const toggleSelectAllCirculars = () => {
    setSelectedCirculars(selectedCirculars.size === filteredCirculars.length ? new Set() : new Set(filteredCirculars.map(c => c.id)))
  }

  const deleteSelectedCirculars = async () => {
    if (selectedCirculars.size === 0 || !confirm(`Delete ${selectedCirculars.size} selected circular(s)?`)) return
    setDeletingCirculars(true)
    try {
      await Promise.all(Array.from(selectedCirculars).map(id => deleteCircular(id)))
      onCircularsChange(circulars.filter(c => !selectedCirculars.has(c.id)))
      setSelectedCirculars(new Set())
    } catch (error) {
      alert('Error deleting circulars')
    } finally {
      setDeletingCirculars(false)
    }
  }

  // Manuals select functions
  const toggleSelectManual = (id: string) => {
    const newSet = new Set(selectedManuals)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedManuals(newSet)
  }

  const toggleSelectAllManuals = () => {
    setSelectedManuals(selectedManuals.size === filteredManuals.length ? new Set() : new Set(filteredManuals.map(m => m.id)))
  }

  const deleteSelectedManuals = async () => {
    if (selectedManuals.size === 0 || !confirm(`Delete ${selectedManuals.size} selected manual(s)?`)) return
    setDeletingManuals(true)
    try {
      await Promise.all(Array.from(selectedManuals).map(id => deleteManual(id)))
      onManualsChange(manuals.filter(m => !selectedManuals.has(m.id)))
      setSelectedManuals(new Set())
    } catch (error) {
      alert('Error deleting manuals')
    } finally {
      setDeletingManuals(false)
    }
  }

  // Court Cases select functions
  const toggleSelectCase = (id: string) => {
    const newSet = new Set(selectedCases)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedCases(newSet)
  }

  const toggleSelectAllCases = () => {
    setSelectedCases(selectedCases.size === filteredCases.length ? new Set() : new Set(filteredCases.map(c => c.id)))
  }

  const deleteSelectedCases = async () => {
    if (selectedCases.size === 0 || !confirm(`Delete ${selectedCases.size} selected court case(s)?`)) return
    setDeletingCases(true)
    try {
      await Promise.all(Array.from(selectedCases).map(id => deleteCourtCase(id)))
      onCourtCasesChange(courtCases.filter(c => !selectedCases.has(c.id)))
      setSelectedCases(new Set())
    } catch (error) {
      alert('Error deleting court cases')
    } finally {
      setDeletingCases(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Sub-tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {(['circulars', 'manuals', 'court-cases'] as const).map(st => (
          <button
            key={st}
            onClick={() => setSubTab(st)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              subTab === st
                ? 'bg-white text-[var(--primary)] shadow-sm'
                : 'text-gray-600 hover:text-[var(--primary)]'
            }`}
          >
            {st === 'court-cases' ? 'Court Cases' : st.charAt(0).toUpperCase() + st.slice(1)}
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              subTab === st ? 'bg-[var(--primary)] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {st === 'circulars' ? circulars.length : st === 'manuals' ? manuals.length : courtCases.length}
            </span>
          </button>
        ))}
      </div>

      {/* Circulars Sub-Tab */}
      {subTab === 'circulars' && (
        <div className="space-y-5">
          <motion.div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </span>
              {editingCircular ? 'Edit Circular' : 'Add New Circular'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Board Number" value={circularBoardNumber} onChange={(e) => setCircularBoardNumber(e.target.value)} />
                <Input label="Date of Issue" type="date" value={circularDateOfIssue} onChange={(e) => setCircularDateOfIssue(e.target.value)} />
              </div>
              <Input label="Subject" value={circularSubject} onChange={(e) => setCircularSubject(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="URL (optional)" value={circularUrl} onChange={(e) => setCircularUrl(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File (PDF or Image)</label>
                  <input type="file" accept="application/pdf,image/*" className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" onChange={(e) => setCircularFile(e.target.files?.[0] || null)} />
                  <div className="text-xs text-gray-500 mt-1">Provide either a URL or upload a file.</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveCircular}>{editingCircular ? 'Update Circular' : 'Add Circular'}</Button>
                {editingCircular && <Button variant="ghost" onClick={resetCircularForm}>Cancel</Button>}
              </div>
            </div>
          </motion.div>
          <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {circulars.length > 0 && (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search circulars by subject, board number, or date..."
                    value={searchQueryCirculars}
                    onChange={(e) => setSearchQueryCirculars(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
                  />
                  {searchQueryCirculars && (
                    <button
                      onClick={() => setSearchQueryCirculars('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Existing Circulars ({filteredCirculars.length}{searchQueryCirculars && ` of ${circulars.length}`})</h3>
              <div className="flex items-center gap-3">
                {selectModeCirculars ? (
                  <>
                    {filteredCirculars.length > 0 && (
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                        <input
                          type="checkbox"
                          checked={filteredCirculars.length > 0 && selectedCirculars.size === filteredCirculars.length}
                          onChange={toggleSelectAllCirculars}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        Select All
                      </label>
                    )}
                    {selectedCirculars.size > 0 && (
                      <button
                        onClick={deleteSelectedCirculars}
                        disabled={deletingCirculars}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                      >
                        {deletingCirculars ? 'Deleting...' : `Delete ${selectedCirculars.size} Selected`}
                      </button>
                    )}
                    <Button variant="secondary" onClick={() => { setSelectModeCirculars(false); setSelectedCirculars(new Set()); }}>Cancel</Button>
                  </>
                ) : (
                  filteredCirculars.length > 0 && <Button variant="secondary" onClick={() => setSelectModeCirculars(true)}>Select</Button>
                )}
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredCirculars.map(c => (
                <div key={c.id} className={`p-5 flex items-center gap-4 transition-colors ${selectedCirculars.has(c.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  {selectModeCirculars && (
                    <input
                      type="checkbox"
                      checked={selectedCirculars.has(c.id)}
                      onChange={() => toggleSelectCircular(c.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{c.subject}</div>
                    <div className="text-sm text-gray-600 mt-1">{c.boardNumber} • {c.dateOfIssue}</div>
                    {c.url && <div className="text-sm text-[var(--primary)] mt-1"><a className="underline hover:text-[var(--accent)]" href={c.url} target="_blank" rel="noreferrer">View Document →</a></div>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEditCircular(c)}>Edit</Button>
                  </div>
                </div>
              ))}
              {circulars.length === 0 && <div className="p-8 text-center text-gray-500">No circulars found. Add your first circular above.</div>}
              {circulars.length > 0 && filteredCirculars.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No circulars match your search. <button onClick={() => setSearchQueryCirculars('')} className="text-[var(--primary)] underline hover:text-[var(--accent)]">Clear search</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Manuals Sub-Tab */}
      {subTab === 'manuals' && (
        <div className="space-y-5">
          <motion.div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </span>
              {editingManual ? 'Edit Manual' : 'Add New Manual'}
            </h3>
            <div className="space-y-4">
              <Input label="Title" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as 'technical' | 'social' | 'organizational' | 'general')}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="social">Social</option>
                  <option value="organizational">Organizational</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="URL (optional)" value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File (PDF or Image)</label>
                  <input type="file" accept="application/pdf,image/*" className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={(e) => setManualFile(e.target.files?.[0] || null)} />
                  <div className="text-xs text-gray-500 mt-1">Provide either a URL or upload a file.</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveManual}>{editingManual ? 'Update Manual' : 'Add Manual'}</Button>
                {editingManual && <Button variant="ghost" onClick={resetManualForm}>Cancel</Button>}
              </div>
            </div>
          </motion.div>
          <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {manuals.length > 0 && (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search manuals by title..."
                    value={searchQueryManuals}
                    onChange={(e) => setSearchQueryManuals(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
                  />
                  {searchQueryManuals && (
                    <button
                      onClick={() => setSearchQueryManuals('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Existing Manuals ({filteredManuals.length}{searchQueryManuals && ` of ${manuals.length}`})</h3>
              <div className="flex items-center gap-3">
                {selectModeManuals ? (
                  <>
                    {filteredManuals.length > 0 && (
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                        <input
                          type="checkbox"
                          checked={filteredManuals.length > 0 && selectedManuals.size === filteredManuals.length}
                          onChange={toggleSelectAllManuals}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        Select All
                      </label>
                    )}
                    {selectedManuals.size > 0 && (
                      <button
                        onClick={deleteSelectedManuals}
                        disabled={deletingManuals}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                      >
                        {deletingManuals ? 'Deleting...' : `Delete ${selectedManuals.size} Selected`}
                      </button>
                    )}
                    <Button variant="secondary" onClick={() => { setSelectModeManuals(false); setSelectedManuals(new Set()); }}>Cancel</Button>
                  </>
                ) : (
                  filteredManuals.length > 0 && <Button variant="secondary" onClick={() => setSelectModeManuals(true)}>Select</Button>
                )}
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredManuals.map(m => (
                <div key={m.id} className={`p-5 flex items-center gap-4 transition-colors ${selectedManuals.has(m.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  {selectModeManuals && (
                    <input
                      type="checkbox"
                      checked={selectedManuals.has(m.id)}
                      onChange={() => toggleSelectManual(m.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-800">{m.title}</div>
                      {m.category && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                          {m.category.charAt(0).toUpperCase() + m.category.slice(1)}
                        </span>
                      )}
                    </div>
                    {m.url && <div className="text-sm text-[var(--primary)] mt-1"><a className="underline hover:text-[var(--accent)]" href={m.url} target="_blank" rel="noreferrer">View Document →</a></div>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEditManual(m)}>Edit</Button>
                  </div>
                </div>
              ))}
              {manuals.length === 0 && <div className="p-8 text-center text-gray-500">No manuals found. Add your first manual above.</div>}
              {manuals.length > 0 && filteredManuals.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No manuals match your search. <button onClick={() => setSearchQueryManuals('')} className="text-[var(--primary)] underline hover:text-[var(--accent)]">Clear search</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Court Cases Sub-Tab */}
      {subTab === 'court-cases' && (
        <div className="space-y-5">
          <motion.div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              </span>
              {editingCourtCase ? 'Edit Court Case' : 'Add New Court Case'}
            </h3>
            <div className="space-y-4">
              <Input label="Case Number" value={caseCaseNumber} onChange={(e) => setCaseCaseNumber(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Date" type="date" value={caseDate} onChange={(e) => setCaseDate(e.target.value)} />
                <Input label="Subject" value={caseSubject} onChange={(e) => setCaseSubject(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveCourtCase}>{editingCourtCase ? 'Update Case' : 'Add Case'}</Button>
                {editingCourtCase && <Button variant="ghost" onClick={resetCourtCaseForm}>Cancel</Button>}
              </div>
            </div>
          </motion.div>
          <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {courtCases.length > 0 && (
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search court cases by case number, subject, or date..."
                    value={searchQueryCases}
                    onChange={(e) => setSearchQueryCases(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
                  />
                  {searchQueryCases && (
                    <button
                      onClick={() => setSearchQueryCases('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Existing Court Cases ({filteredCases.length}{searchQueryCases && ` of ${courtCases.length}`})</h3>
              <div className="flex items-center gap-3">
                {selectModeCases ? (
                  <>
                    {filteredCases.length > 0 && (
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                        <input
                          type="checkbox"
                          checked={filteredCases.length > 0 && selectedCases.size === filteredCases.length}
                          onChange={toggleSelectAllCases}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        Select All
                      </label>
                    )}
                    {selectedCases.size > 0 && (
                      <button
                        onClick={deleteSelectedCases}
                        disabled={deletingCases}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                      >
                        {deletingCases ? 'Deleting...' : `Delete ${selectedCases.size} Selected`}
                      </button>
                    )}
                    <Button variant="secondary" onClick={() => { setSelectModeCases(false); setSelectedCases(new Set()); }}>Cancel</Button>
                  </>
                ) : (
                  filteredCases.length > 0 && <Button variant="secondary" onClick={() => setSelectModeCases(true)}>Select</Button>
                )}
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredCases.map(c => (
                <div key={c.id} className={`p-5 flex items-center gap-4 transition-colors ${selectedCases.has(c.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                  {selectModeCases && (
                    <input
                      type="checkbox"
                      checked={selectedCases.has(c.id)}
                      onChange={() => toggleSelectCase(c.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{c.caseNumber}</div>
                    <div className="text-sm text-gray-600 mt-1">{new Date(c.date).toLocaleDateString()} • {c.subject}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleEditCourtCase(c)}>Edit</Button>
                  </div>
                </div>
              ))}
              {courtCases.length === 0 && <div className="p-8 text-center text-gray-500">No court cases found. Add your first case above.</div>}
              {courtCases.length > 0 && filteredCases.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No court cases match your search. <button onClick={() => setSearchQueryCases('')} className="text-[var(--primary)] underline hover:text-[var(--accent)]">Clear search</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Keep old functions for backward compatibility but they're no longer used
function ManualsAdmin({ data, onChange }: { data: Manual[]; onChange: (d: Manual[])=>void }){
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    setSelected(selected.size === data.length ? new Set() : new Set(data.map(m => m.id)))
  }

  const deleteSelected = async () => {
    if (selected.size === 0 || !confirm(`Delete ${selected.size} selected manual(s)?`)) return
    setDeleting(true)
    try {
      await Promise.all(Array.from(selected).map(id => deleteManual(id)))
      onChange(data.filter(m => !selected.has(m.id)))
      setSelected(new Set())
    } catch (error) {
      alert('Error deleting manuals')
    } finally {
      setDeleting(false)
    }
  }
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
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Existing Manuals ({data.length})</h3>
          <div className="flex items-center gap-3">
            {selectMode ? (
              <>
                {data.length > 0 && (
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={data.length > 0 && selected.size === data.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    Select All
                  </label>
                )}
                {selected.size > 0 && (
                  <button
                    onClick={deleteSelected}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                  >
                    {deleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                  </button>
                )}
                <Button variant="secondary" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</Button>
              </>
            ) : (
              data.length > 0 && <Button variant="secondary" onClick={() => setSelectMode(true)}>Select</Button>
            )}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {data.map(m=> (
            <div key={m.id} className={`p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors ${selected.has(m.id) ? 'bg-blue-50' : ''}`}>
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.has(m.id)}
                  onChange={() => toggleSelect(m.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{m.title}</div>
                {m.url && <div className="text-sm text-[var(--primary)] mt-1"><a className="underline hover:text-[var(--accent)]" href={m.url} target="_blank" rel="noreferrer">View Document →</a></div>}
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
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    setSelected(selected.size === data.length ? new Set() : new Set(data.map(c => c.id)))
  }

  const deleteSelected = async () => {
    if (selected.size === 0 || !confirm(`Delete ${selected.size} selected circular(s)?`)) return
    setDeleting(true)
    try {
      await Promise.all(Array.from(selected).map(id => deleteCircular(id)))
      onChange(data.filter(c => !selected.has(c.id)))
      setSelected(new Set())
    } catch (error) {
      alert('Error deleting circulars')
    } finally {
      setDeleting(false)
    }
  }
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
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Existing Circulars ({data.length})</h3>
          <div className="flex items-center gap-3">
            {selectMode ? (
              <>
                {data.length > 0 && (
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={data.length > 0 && selected.size === data.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    Select All
                  </label>
                )}
                {selected.size > 0 && (
                  <button
                    onClick={deleteSelected}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                  >
                    {deleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                  </button>
                )}
                <Button variant="secondary" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</Button>
              </>
            ) : (
              data.length > 0 && <Button variant="secondary" onClick={() => setSelectMode(true)}>Select</Button>
            )}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {data.map(c=> (
            <div key={c.id} className={`p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors ${selected.has(c.id) ? 'bg-blue-50' : ''}`}>
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggleSelect(c.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{c.subject}</div>
                <div className="text-sm text-gray-600 mt-1">{c.boardNumber} • {c.dateOfIssue}</div>
                {c.url && <div className="text-sm text-[var(--primary)] mt-1"><a className="underline hover:text-[var(--accent)]" href={c.url} target="_blank" rel="noreferrer">View Document →</a></div>}
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
  const [category, setCategory] = useState<'technical' | 'social' | 'organizational' | 'general'>('general')
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTopics = data.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.category || 'general').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    setSelected(selected.size === filteredTopics.length ? new Set() : new Set(filteredTopics.map(t => t.id)))
  }

  const deleteSelected = async () => {
    if (selected.size === 0 || !confirm(`Delete ${selected.size} selected topic(s)?`)) return
    setDeleting(true)
    try {
      await Promise.all(Array.from(selected).map(id => deleteForumTopic(id)))
      onChange(data.filter(t => !selected.has(t.id)))
      setSelected(new Set())
    } catch (error) {
      alert('Error deleting topics')
    } finally {
      setDeleting(false)
    }
  }

  const startEdit = (topic: ForumTopic) => {
    setEditingId(topic.id)
    setEditTitle(topic.title)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const saveEdit = async () => {
    if (!editingId || !editTitle.trim()) return
    try {
      const updated = await updateForumTopic(editingId, { title: editTitle.trim() })
      onChange(data.map(t => t.id === editingId ? updated : t))
      setEditingId(null)
      setEditTitle('')
    } catch (error) {
      alert('Error updating topic')
    }
  }

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              value={category} 
              onChange={(e)=>setCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="social">Social</option>
              <option value="organizational">Organizational</option>
            </select>
          </div>
          <Button onClick={async()=>{ const t = await createForumTopic({ title, author, category }); onChange([t, ...data]); setTitle(''); setCategory('general') }}>Add Topic</Button>
        </div>
      </motion.div>
      <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {data.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search topics by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Existing Topics ({filteredTopics.length}{searchQuery && ` of ${data.length}`})</h3>
          <div className="flex items-center gap-3">
            {selectMode ? (
              <>
                {filteredTopics.length > 0 && (
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={filteredTopics.length > 0 && selected.size === filteredTopics.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    Select All
                  </label>
                )}
                {selected.size > 0 && (
                  <button
                    onClick={deleteSelected}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                  >
                    {deleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                  </button>
                )}
                <Button variant="secondary" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</Button>
              </>
            ) : (
              filteredTopics.length > 0 && <Button variant="secondary" onClick={() => setSelectMode(true)}>Select</Button>
            )}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredTopics.map(t => (
            <div key={t.id} className={`p-5 flex items-center gap-4 transition-colors ${selected.has(t.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.has(t.id)}
                  onChange={() => toggleSelect(t.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              )}
              <div className="flex-1">
                {editingId === t.id ? (
                  <div className="space-y-2">
                    <Input
                      label="Topic Title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={saveEdit}>Save</Button>
                      <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-800">{t.title}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                        {t.category || 'general'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">By {t.author} • {new Date(t.createdAt).toLocaleDateString()} • {t.replies} replies</div>
                  </>
                )}
              </div>
              {!selectMode && editingId !== t.id && (
                <Button variant="secondary" onClick={() => startEdit(t)}>Edit</Button>
              )}
            </div>
          ))}
          {data.length === 0 && <div className="p-8 text-center text-gray-500">No forum topics found. Add your first topic above.</div>}
          {data.length > 0 && filteredTopics.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No topics match your search. <button onClick={() => setSearchQuery('')} className="text-[var(--primary)] underline hover:text-[var(--accent)]">Clear search</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function CourtCasesAdmin({ data, onChange }: { data: CourtCase[]; onChange: (d: CourtCase[])=>void }){
  const [caseNumber, setCaseNumber] = useState('')
  const [date, setDate] = useState('')
  const [subject, setSubject] = useState('')
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    setSelected(selected.size === data.length ? new Set() : new Set(data.map(c => c.id)))
  }

  const deleteSelected = async () => {
    if (selected.size === 0 || !confirm(`Delete ${selected.size} selected court case(s)?`)) return
    setDeleting(true)
    try {
      await Promise.all(Array.from(selected).map(id => deleteCourtCase(id)))
      onChange(data.filter(c => !selected.has(c.id)))
      setSelected(new Set())
    } catch (error) {
      alert('Error deleting court cases')
    } finally {
      setDeleting(false)
    }
  }
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
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Existing Court Cases ({data.length})</h3>
          <div className="flex items-center gap-3">
            {selectMode ? (
              <>
                {data.length > 0 && (
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={data.length > 0 && selected.size === data.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    Select All
                  </label>
                )}
                {selected.size > 0 && (
                  <button
                    onClick={deleteSelected}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                  >
                    {deleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                  </button>
                )}
                <Button variant="secondary" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</Button>
              </>
            ) : (
              data.length > 0 && <Button variant="secondary" onClick={() => setSelectMode(true)}>Select</Button>
            )}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {data.map(c => (
            <div key={c.id} className={`p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors ${selected.has(c.id) ? 'bg-blue-50' : ''}`}>
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selected.has(c.id)}
                  onChange={() => toggleSelect(c.id)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{c.caseNumber}</div>
                <div className="text-sm text-gray-600 mt-1">{new Date(c.date).toLocaleDateString()} • {c.subject}</div>
              </div>
            </div>
          ))}
          {data.length===0 && <div className="p-8 text-center text-gray-500">No court cases found. Add your first case above.</div>}
        </div>
      </motion.div>
    </div>
  )
}

function SuggestionsAdmin({ data, onChange }: { data: Suggestion[]; onChange: (s: Suggestion[]) => void }){
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(data.map(s => s.id)))
    }
  }

  const deleteSelected = async () => {
    if (selected.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selected.size} selected suggestion(s)?`)) return
    
    setDeleting(true)
    try {
      await Promise.all(Array.from(selected).map(id => deleteSuggestion(id)))
      onChange(data.filter(s => !selected.has(s.id)))
      setSelected(new Set())
    } catch (error) {
      alert('Error deleting suggestions')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      <motion.div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </span>
              User Suggestions ({data.length})
            </h3>
            <div className="flex items-center gap-3">
              {selectMode ? (
                <>
                  {data.length > 0 && (
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                      <input
                        type="checkbox"
                        checked={selected.size === data.length && data.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      Select All
                    </label>
                  )}
                  {selected.size > 0 && (
                    <Button
                      variant="danger"
                      onClick={deleteSelected}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                    </Button>
                  )}
                  <Button variant="secondary" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</Button>
                </>
              ) : (
                data.length > 0 && <Button variant="secondary" onClick={() => setSelectMode(true)}>Select</Button>
              )}
            </div>
          </div>
        </div>
        {data.length===0 && <div className="p-8 text-center text-gray-500">No suggestions submitted yet.</div>}
        <div className="divide-y divide-gray-100">
          {data.map(s => (
            <div key={s.id} className={`p-6 transition-colors ${selected.has(s.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
              <div className="flex items-start gap-3">
                {selectMode && (
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggleSelect(s.id)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {new Date(s.createdAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-lg">{s.userName}</div>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this suggestion?')) {
                            await deleteSuggestion(s.id)
                            onChange(data.filter(item => item.id !== s.id))
                            setSelected(prev => {
                              const newSelected = new Set(prev)
                              newSelected.delete(s.id)
                              return newSelected
                            })
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete suggestion"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{s.text}</p>
                  {s.fileNames?.length>0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        <span>Attachments ({s.fileNames.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {s.fileNames.map((fileName, idx) => (
                          <a
                            key={idx}
                            href={`${import.meta.env?.VITE_API_URL || 'http://localhost:5001'}/uploads/suggestions/${fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {fileName}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-2">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>Click on any attachment to download and view the supporting documents submitted by members.</span>
      </div>
    </div>
  )
}

function SettingsAdmin({ data, onChange }: { data: Setting[]; onChange: (s: Setting[]) => void }) {
  const [editing, setEditing] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Initialize editing state with current settings values
    const initialEditing: Record<string, number> = {}
    data.forEach(setting => {
      initialEditing[setting.key] = setting.value
    })
    setEditing(initialEditing)
  }, [data])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Find settings that have changed
      const updatedSettings: Setting[] = data
        .filter(setting => editing[setting.key] !== undefined && editing[setting.key] !== setting.value)
        .map(setting => ({
          ...setting,
          value: editing[setting.key]
        }))

      if (updatedSettings.length > 0) {
        const result = await updateMultipleSettings(updatedSettings)
        onChange(data.map(s => {
          const updated = result.find(r => r.key === s.key)
          return updated || s
        }))
        alert('✅ Membership prices updated successfully!\n\nChanges have been saved to the database and will be reflected on the membership page immediately.')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('❌ Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const membershipSettings = data.filter(s => s.category === 'Membership Settings')
  const hasChanges = data.some(s => editing[s.key] !== undefined && editing[s.key] !== s.value)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
      >
        <div className="to-[#ffffff] p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </span>
            Membership Settings
          </h2>
          <p className="text-black/90 mt-2">Configure membership pricing for ordinary and lifetime plans</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Membership Pricing Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-[var(--accent)] to-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Membership Pricing
            </h3>

            {membershipSettings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-gray-600 font-medium mb-2">No membership pricing settings found</p>
                <p className="text-sm text-gray-500 mb-4">The settings need to be initialized in the database.</p>
                <Button onClick={async () => {
                  try {
                    const response = await fetch(`${import.meta.env?.VITE_API_URL || 'http://localhost:5001'}/api/settings/initialize`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('crea:token')}`,
                        'Content-Type': 'application/json'
                      }
                    })
                    
                    if (!response.ok) {
                      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
                      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
                    }
                    
                    alert('Settings initialized successfully!')
                    const newSettings = await getSettings()
                    onChange(newSettings)
                  } catch (error) {
                    console.error('Failed to initialize settings:', error)
                    alert(`Failed to initialize settings: ${(error as Error).message}`)
                  }
                }}>
                  Initialize Default Settings
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {membershipSettings.map(setting => (
                <motion.div
                  key={setting.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border-2 border-gray-200 hover:border-[var(--primary)]/30 transition-colors"
                >
                  <label className="block">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        {setting.key.includes('ordinary') ? '📝 Ordinary Membership' : '⭐ Lifetime Membership'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        editing[setting.key] !== setting.value
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {editing[setting.key] !== setting.value ? 'Modified' : 'Current'}
                      </span>
                    </div>
                    
                    {setting.description && (
                      <p className="text-xs text-gray-600 mb-3">{setting.description}</p>
                    )}
                    
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">₹</span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg font-bold focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                        value={editing[setting.key] ?? setting.value}
                        onChange={(e) => setEditing({ ...editing, [setting.key]: Number(e.target.value) })}
                        min="0"
                        step="100"
                      />
                    </div>
                    
                    {editing[setting.key] !== setting.value && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                        <span>Previous: ₹{setting.value}</span>
                        <span>→</span>
                        <span className="font-bold text-[var(--primary)]">New: ₹{editing[setting.key]}</span>
                      </div>
                    )}
                  </label>
                </motion.div>
              ))}
            </div>
            )}
          </div>

          {/* Save Button */}
          {membershipSettings.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Changes will be reflected immediately on the membership page</span>
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              loading={saving}
            >
              {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
            </Button>
          </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function AssociationBodyAdmin() {
  const [bodyMembers, setBodyMembers] = useState<BodyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<Division | ''>('')
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<Omit<BodyMember, 'id'>>({ name: '', designation: '', photoUrl: '', division: 'Mumbai' })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')

  useEffect(() => {
    getBodyMembers(selectedDivision || undefined)
      .then(data => {
        setBodyMembers(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Fetch body members error:', error)
        setLoading(false)
      })
  }, [selectedDivision])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPhotoPreview(result)
        setForm({ ...form, photoUrl: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreate = async () => {
    try {
      await createBodyMember(form)
      // Refresh the list from server to ensure consistency
      const updatedList = await getBodyMembers(selectedDivision || undefined)
      setBodyMembers(updatedList)
      setForm({ name: '', designation: '', photoUrl: '', division: 'Mumbai' })
      setPhotoFile(null)
      setPhotoPreview('')
      setOpenCreate(false)
    } catch (error) {
      console.error('Create body member error:', error)
      alert('Failed to create body member')
    }
  }

  const handleEdit = (member: BodyMember) => {
    setEditingId(member.id)
    setForm({ name: member.name, designation: member.designation, photoUrl: member.photoUrl, division: member.division })
    setPhotoPreview(member.photoUrl)
  }

  const handleUpdate = async () => {
    if (!editingId) return
    try {
      await updateBodyMember(editingId, form)
      // Refresh the list from server to ensure consistency
      const updatedList = await getBodyMembers(selectedDivision || undefined)
      setBodyMembers(updatedList)
      setEditingId(null)
      setForm({ name: '', designation: '', photoUrl: '', division: 'Mumbai' })
      setPhotoFile(null)
      setPhotoPreview('')
    } catch (error) {
      console.error('Update body member error:', error)
      alert('Failed to update body member')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this body member?')) {
      try {
        await deleteBodyMember(id)
        // Clear from selected if it was selected
        setSelected(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        // Refresh the list from server to ensure consistency
        const updatedList = await getBodyMembers(selectedDivision || undefined)
        setBodyMembers(updatedList)
      } catch (error) {
        console.error('Delete body member error:', error)
        alert('Failed to delete body member')
      }
    }
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === bodyMembers.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(bodyMembers.map(m => m.id)))
    }
  }

  const deleteSelected = async () => {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} selected member(s)?`)) return

    setDeleting(true)
    try {
      await Promise.all(Array.from(selected).map(id => deleteBodyMember(id)))
      setSelected(new Set())
      const updatedList = await getBodyMembers(selectedDivision || undefined)
      setBodyMembers(updatedList)
    } catch (error) {
      console.error('Bulk delete error:', error)
      alert('Failed to delete some members')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-gray-600">Loading body members...</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Card with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[#1a4d8f] to-[var(--primary)] p-8 text-white shadow-xl"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold !text-white">Association Body</h2>
                  <p className="text-white/80 text-sm">Manage office bearers and executive members</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setOpenCreate(true)} 
              variant="secondary"
              className="bg-white !text-[var(--primary)] hover:bg-white/90 shadow-lg font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </Button>
          </div>
        </div>
        
        {/* Decorative blobs */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Filter Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md border border-gray-200 p-5"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <label className="text-sm font-semibold">Filter by Division:</label>
          </div>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value as Division | '')}
            className="flex-1 max-w-xs px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all"
          >
            <option value="">All Divisions ({bodyMembers.length})</option>
            {DIVISIONS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {selectedDivision && (
            <button
              onClick={() => setSelectedDivision('')}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Members Grid/Table */}
      {bodyMembers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 p-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Members Yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first body member</p>
          <Button onClick={() => setOpenCreate(true)} variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add First Member
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
        >
          {selectMode && (
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={bodyMembers.length > 0 && selected.size === bodyMembers.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  Select All
                </label>
                {selected.size > 0 && (
                  <span className="text-blue-700 font-semibold">
                    {selected.size} member(s) selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selected.size > 0 && (
                  <button
                    onClick={deleteSelected}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors text-sm"
                  >
                    {deleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                  </button>
                )}
                <Button variant="secondary" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</Button>
              </div>
            </div>
          )}
          {!selectMode && bodyMembers.length > 0 && (
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectMode(true)}>Select</Button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  {selectMode && <th className="px-6 py-4 text-center w-12"></th>}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Photo
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Division</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bodyMembers.map((member, index) => (
                  <motion.tr 
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-blue-50/50 transition-colors group ${selected.has(member.id) ? 'bg-blue-50' : ''}`}
                  >
                    {selectMode && (
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selected.has(member.id)}
                          onChange={() => toggleSelect(member.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <img 
                          src={member.photoUrl} 
                          alt={member.name} 
                          className="w-14 h-14 rounded-full object-cover border-3 border-gray-200 shadow-md group-hover:border-[var(--primary)] transition-all ring-2 ring-transparent group-hover:ring-[var(--primary)]/20" 
                        />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">{member.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-sm text-gray-700 font-medium">{member.designation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {member.division}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-600 hover:text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-600 hover:text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                Showing <span className="font-bold text-gray-900">{bodyMembers.length}</span> member{bodyMembers.length !== 1 ? 's' : ''}
                {selectedDivision && <span> in <span className="font-bold text-[var(--primary)]">{selectedDivision}</span></span>}
              </span>
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      {(openCreate || editingId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingId ? 'Edit Body Member' : 'Add Body Member'}
            </h3>
            <div className="space-y-4">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter full name"
              />
              <Input
                label="Designation"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g., President, Secretary"
              />
              
              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Photo</label>
                <div className="space-y-3">
                  {/* Preview */}
                  {photoPreview && (
                    <div className="flex justify-center">
                      <div className="relative">
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
                        />
                        <button
                          onClick={() => {
                            setPhotoPreview('')
                            setPhotoFile(null)
                            setForm({ ...form, photoUrl: '' })
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[var(--primary)] hover:bg-gray-50 transition-all">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-500">
                        {photoFile ? photoFile.name : 'Click to upload or drag and drop'}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>

                  {/* OR divider */}
                  <div className="relative flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  {/* URL Input */}
                  <Input
                    label=""
                    value={form.photoUrl}
                    onChange={(e) => {
                      setForm({ ...form, photoUrl: e.target.value })
                      setPhotoPreview(e.target.value)
                      setPhotoFile(null)
                    }}
                    placeholder="Or paste photo URL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Division</label>
                <select
                  value={form.division}
                  onChange={(e) => setForm({ ...form, division: e.target.value as Division })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  {DIVISIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={editingId ? handleUpdate : handleCreate}
                variant="primary"
                disabled={!form.name || !form.designation}
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button
                onClick={() => {
                  setOpenCreate(false)
                  setEditingId(null)
                  setForm({ name: '', designation: '', photoUrl: '', division: 'Mumbai' })
                  setPhotoFile(null)
                  setPhotoPreview('')
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function MutualTransfersAdmin({ data, onChange }: { data: MutualTransfer[]; onChange: (data: MutualTransfer[]) => void }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ post: '', currentLocation: '', desiredLocation: '', contactPhone: '', notes: '' })
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelected(newSelected)
  }

  const toggleSelectAll = () => {
    setSelected(selected.size === data.length ? new Set() : new Set(data.map(t => t.id)))
  }

  const deleteSelected = async () => {
    if (selected.size === 0 || !confirm(`Delete ${selected.size} selected transfer(s)?`)) return
    setDeleting(true)
    try {
      await Promise.all(Array.from(selected).map(id => deleteMutualTransfer(id)))
      onChange(data.filter(t => !selected.has(t.id)))
      setSelected(new Set())
    } catch (error) {
      alert('Error deleting transfers')
    } finally {
      setDeleting(false)
    }
  }

  const handleCreate = async () => {
    try {
      await createMutualTransfer(form)
      const refreshed = await getMutualTransfers({ includeInactive: true })
      onChange(refreshed)
      setOpenCreate(false)
      setForm({ post: '', currentLocation: '', desiredLocation: '', contactPhone: '', notes: '' })
    } catch {
      alert('Error creating transfer')
    }
  }

  const handleUpdate = async () => {
    if (!editingId) return
    try {
      await updateMutualTransfer(editingId, form)
      const refreshed = await getMutualTransfers({ includeInactive: true })
      onChange(refreshed)
      setEditingId(null)
      setOpenCreate(false)
      setForm({ post: '', currentLocation: '', desiredLocation: '', contactPhone: '', notes: '' })
    } catch {
      alert('Error updating transfer')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transfer?')) return
    try {
      await deleteMutualTransfer(id)
      onChange(data.filter(item => item.id !== id))
    } catch {
      alert('Error deleting transfer')
    }
  }

  const handleEdit = (item: MutualTransfer) => {
    setEditingId(item.id)
    setForm({ post: item.post, currentLocation: item.currentLocation, desiredLocation: item.desiredLocation, contactPhone: item.contactPhone, notes: item.notes })
    setOpenCreate(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mutual Transfers</h2>
        <div className="flex items-center gap-3">
          {selectMode ? (
            <>
              {data.length > 0 && (
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input type="checkbox" checked={selected.size === data.length && data.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
                  Select All
                </label>
              )}
              {selected.size > 0 && (
                <Button variant="danger" onClick={deleteSelected} disabled={deleting}>
                  {deleting ? 'Deleting...' : `Delete ${selected.size} Selected`}
                </Button>
              )}
              <Button variant="secondary" onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</Button>
            </>
          ) : (
            data.length > 0 && <Button variant="secondary" onClick={() => setSelectMode(true)}>Select</Button>
          )}
          <Button onClick={() => setOpenCreate(true)} variant="primary">Add Transfer</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {data.map(item => (
          <div key={item.id} className={`border rounded-lg p-4 transition-colors ${selected.has(item.id) ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
            <div className="flex justify-between items-start gap-3">
              {selectMode && <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleSelect(item.id)} className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" />}
              <div>
                <div className="font-semibold">{item.post}</div>
                <div className="text-sm text-gray-600">From: {item.currentLocation} → To: {item.desiredLocation}</div>
                <div className="text-sm text-gray-600">Contact: {item.contactPhone}</div>
                {item.notes && <div className="text-sm text-gray-500 mt-1">{item.notes}</div>}
                <div className="text-xs text-gray-400 mt-1">{item.isActive ? 'Active' : 'Inactive'}</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(item)} variant="secondary">Edit</Button>
                <Button onClick={() => handleDelete(item.id)} variant="danger">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md space-y-4"
          >
            <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Transfer</h3>
            <Input label="Post" value={form.post} onChange={e => setForm({ ...form, post: e.target.value })} />
            <Input label="Current Location" value={form.currentLocation} onChange={e => setForm({ ...form, currentLocation: e.target.value })} />
            <Input label="Desired Location" value={form.desiredLocation} onChange={e => setForm({ ...form, desiredLocation: e.target.value })} />
            <Input label="Contact Phone" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
            <Input label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleCreate} variant="primary">
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => { setOpenCreate(false); setEditingId(null); setForm({ post: '', currentLocation: '', desiredLocation: '', contactPhone: '', notes: '' }) }} variant="secondary">
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function ForumApprovalAdmin({ 
  pendingPosts, 
  pendingComments, 
  onPostsChange, 
  onCommentsChange 
}: { 
  pendingPosts: PendingForumPost[]
  pendingComments: PendingForumComment[]
  onPostsChange: (posts: PendingForumPost[]) => void
  onCommentsChange: (comments: PendingForumComment[]) => void
}) {
  const [loading, setLoading] = useState(false)

  const handleApprovePost = async (postId: string) => {
    setLoading(true)
    try {
      await approveForumPost(postId)
      onPostsChange(pendingPosts.filter(p => p._id !== postId))
      alert('Post approved successfully!')
    } catch (error) {
      alert('Error approving post: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectPost = async (postId: string) => {
    if (!confirm('Are you sure you want to reject and delete this post?')) return
    setLoading(true)
    try {
      await rejectForumPost(postId)
      onPostsChange(pendingPosts.filter(p => p._id !== postId))
      alert('Post rejected and deleted')
    } catch (error) {
      alert('Error rejecting post: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveComment = async (postId: string, commentIndex: number) => {
    setLoading(true)
    try {
      await approveForumComment(postId, commentIndex)
      onCommentsChange(pendingComments.filter(c => !(c.postId === postId && c.commentIndex === commentIndex)))
      alert('Comment approved successfully!')
    } catch (error) {
      alert('Error approving comment: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectComment = async (postId: string, commentIndex: number) => {
    if (!confirm('Are you sure you want to reject and delete this comment?')) return
    setLoading(true)
    try {
      await rejectForumComment(postId, commentIndex)
      onCommentsChange(pendingComments.filter(c => !(c.postId === postId && c.commentIndex === commentIndex)))
      alert('Comment rejected and deleted')
    } catch (error) {
      alert('Error rejecting comment: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Forum Moderation</h2>
            <p className="text-sm text-gray-500 mt-1">Review and approve pending forum posts and comments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <span className="text-sm text-orange-700 font-medium">{pendingPosts.length} Pending Posts</span>
            </div>
            <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm text-blue-700 font-medium">{pendingComments.length} Pending Comments</span>
            </div>
          </div>
        </div>

        {/* Pending Posts Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Pending Posts ({pendingPosts.length})
          </h3>
          <div className="space-y-4">
            {pendingPosts.length === 0 ? (
              <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">No pending posts</p>
            ) : (
              pendingPosts.map(post => (
                <motion.div
                  key={post._id}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                          {post.topicTitle}
                        </span>
                        <span className="text-sm text-gray-500">by {post.author}</span>
                        <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprovePost(post._id)}
                        disabled={loading}
                        variant="primary"
                        className="!py-1 !px-3 !text-sm"
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectPost(post._id)}
                        disabled={loading}
                        variant="secondary"
                        className="!py-1 !px-3 !text-sm !bg-red-50 !text-red-600 hover:!bg-red-100"
                      >
                        ✗ Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Pending Comments Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Pending Comments ({pendingComments.length})
          </h3>
          <div className="space-y-4">
            {pendingComments.length === 0 ? (
              <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">No pending comments</p>
            ) : (
              pendingComments.map((comment, idx) => (
                <motion.div
                  key={`${comment.postId}-${comment.commentIndex}`}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                          {comment.topicTitle}
                        </span>
                        <span className="text-xs text-gray-400">Comment on: {comment.postContent}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500">by {comment.author}</span>
                        <span className="text-xs text-gray-400">{comment.createdAt}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveComment(comment.postId, comment.commentIndex)}
                        disabled={loading}
                        variant="primary"
                        className="!py-1 !px-3 !text-sm"
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectComment(comment.postId, comment.commentIndex)}
                        disabled={loading}
                        variant="secondary"
                        className="!py-1 !px-3 !text-sm !bg-red-50 !text-red-600 hover:!bg-red-100"
                      >
                        ✗ Reject
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function DonationsAdmin() {
  const [donations, setDonations] = useState<import('../types').Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('crea:token')
      if (!token) {
        console.error('No authentication token found')
        setLoading(false)
        return
      }
      const response = await fetch('http://localhost:5001/api/donations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      console.log('Donations response:', data)
      if (data.success) {
        setDonations(data.data)
      } else {
        console.error('Failed to fetch donations:', data.message)
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Name',
      'Email',
      'Mobile',
      'Amount',
      'Purpose',
      'Anonymous',
      'Employee',
      'Employee ID',
      'Designation',
      'Division',
      'Department',
      'Address',
      'City',
      'State',
      'Pincode',
      'Message',
      'Payment Status'
    ]

    const rows = donations.map(d => [
      new Date(d.createdAt).toLocaleDateString(),
      d.isAnonymous ? 'Anonymous' : d.fullName,
      d.isAnonymous ? '' : d.email,
      d.isAnonymous ? '' : d.mobile,
      d.amount,
      d.purpose,
      d.isAnonymous ? 'Yes' : 'No',
      d.isEmployee ? 'Yes' : 'No',
      d.employeeId || '',
      d.designation || '',
      d.division || '',
      d.department || '',
      d.address || '',
      d.city || '',
      d.state || '',
      d.pincode || '',
      d.message || '',
      d.paymentStatus
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `donations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    // Create HTML table for Excel
    const headers = [
      'Date',
      'Name',
      'Email',
      'Mobile',
      'Amount',
      'Purpose',
      'Anonymous',
      'Employee',
      'Employee ID',
      'Designation',
      'Division',
      'Department',
      'Address',
      'City',
      'State',
      'Pincode',
      'Message',
      'Payment Status'
    ]

    const rows = donations.map(d => [
      new Date(d.createdAt).toLocaleDateString(),
      d.isAnonymous ? 'Anonymous' : d.fullName,
      d.isAnonymous ? '' : d.email,
      d.isAnonymous ? '' : d.mobile,
      d.amount,
      d.purpose,
      d.isAnonymous ? 'Yes' : 'No',
      d.isEmployee ? 'Yes' : 'No',
      d.employeeId || '',
      d.designation || '',
      d.division || '',
      d.department || '',
      d.address || '',
      d.city || '',
      d.state || '',
      d.pincode || '',
      d.message || '',
      d.paymentStatus
    ])

    const htmlTable = `
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    `

    const blob = new Blob([htmlTable], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `donations_${new Date().toISOString().split('T')[0]}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[#19417d] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">Total Donations</span>
            <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold !text-white" style={{ color: 'white' }}>{formatCurrency(totalDonations)}</div>
          <div className="text-white/80 text-sm mt-1">{donations.length} donation{donations.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="bg-gradient-to-br from-[var(--accent)] to-yellow-500 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">Anonymous Donors</span>
            <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="text-3xl font-bold !text-white" style={{ color: 'white' }}>{donations.filter(d => d.isAnonymous).length}</div>
          <div className="text-white/80 text-sm mt-1">out of {donations.length} total</div>
        </div>

        <div className="bg-gradient-to-br from-[var(--secondary)] to-[#2a5f8f] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/90 text-sm font-medium">Employee Donations</span>
            <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold !text-white" style={{ color: 'white' }}>{donations.filter(d => d.isEmployee).length}</div>
          <div className="text-white/80 text-sm mt-1">from organization members</div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={exportToCSV}
          variant="primary"
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to CSV
        </Button>
        <Button
          onClick={exportToExcel}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to Excel
        </Button>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No donations yet
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {donation.isAnonymous ? 'Anonymous Donor' : donation.fullName}
                          </div>
                          {donation.isEmployee && donation.designation && (
                            <div className="text-xs text-gray-500">{donation.designation}</div>
                          )}
                        </div>
                        {donation.isAnonymous && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            Anonymous
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.isAnonymous ? (
                        <span className="text-sm text-gray-400">Hidden</span>
                      ) : (
                        <div className="text-sm text-gray-900">
                          <div>{donation.email}</div>
                          <div className="text-gray-500">{donation.mobile}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[var(--accent)]">
                        {formatCurrency(donation.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        donation.purpose === 'education' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' :
                        donation.purpose === 'welfare' ? 'bg-[var(--secondary)]/10 text-[var(--secondary)]' :
                        donation.purpose === 'infrastructure' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {donation.purpose.charAt(0).toUpperCase() + donation.purpose.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium inline-block w-fit ${
                          donation.isEmployee ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {donation.isEmployee ? 'Employee' : 'Public'}
                        </span>
                        {donation.isEmployee && donation.division && (
                          <span className="text-xs text-gray-500">{donation.division}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        donation.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                        donation.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {donation.paymentStatus.charAt(0).toUpperCase() + donation.paymentStatus.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
