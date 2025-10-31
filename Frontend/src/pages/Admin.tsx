import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
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
      <SectionHeader title="Admin Panel" subtitle="Manage events, manuals, circulars, court cases, forum topics, and more." />
      {/* Removed demo data loader */}

      {/* Miniature overview of key pages */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StaggerItem>
          <Card title={
            <div className="flex items-center justify-between">
              <span>Events (latest)</span>
              <button className="text-xs text-[var(--primary)] hover:underline" onClick={() => navigate('/events')}>View all</button>
            </div>
          }>
            <ul className="space-y-2">
            {events.slice(0,2).map(e => (
              <li key={e.id}>
                <button onClick={() => navigate('/events')} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-800 truncate">{e.title}</div>
                  <div className="text-xs text-gray-600">{new Date(e.date).toLocaleDateString()} • {e.location}</div>
                </button>
              </li>
            ))}
            {events.length === 0 && <li className="text-sm text-gray-500">No events yet.</li>}
          </ul>
        </Card>
        </StaggerItem>

        <StaggerItem>
        <Card title={
          <div className="flex items-center justify-between">
            <span>Forum</span>
            <button className="text-xs text-[var(--primary)] hover:underline" onClick={() => navigate('/forum')}>View all</button>
          </div>
        }>
          <ul className="space-y-2">
            {topics.slice(0,2).map(t => (
              <li key={t.id}>
                <button onClick={() => navigate('/forum')} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-800 truncate">{t.title}</div>
                  <div className="text-xs text-gray-600">{t.replies} replies • {new Date(t.createdAt).toLocaleDateString()}</div>
                </button>
              </li>
            ))}
            {topics.length === 0 && <li className="text-sm text-gray-500">No topics yet.</li>}
          </ul>
        </Card>
        </StaggerItem>

        <StaggerItem>
        <Card title={
          <div className="flex items-center justify-between">
            <span>Circulars</span>
            <button className="text-xs text-[var(--primary)] hover:underline" onClick={() => navigate('/circulars')}>View all</button>
          </div>
        }>
          <ul className="space-y-2">
            {circulars.slice(0,2).map(c => (
              <li key={c.id}>
                <button onClick={() => navigate('/circulars')} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-800 truncate">{c.subject}</div>
                  <div className="text-xs text-gray-600">{c.boardNumber} • {new Date(c.dateOfIssue).toLocaleDateString()}</div>
                </button>
              </li>
            ))}
            {circulars.length === 0 && <li className="text-sm text-gray-500">No circulars yet.</li>}
          </ul>
        </Card>
        </StaggerItem>

        <StaggerItem>
        <Card title={
          <div className="flex items-center justify-between">
            <span>Court Cases</span>
            <button className="text-xs text-[var(--primary)] hover:underline" onClick={() => navigate('/court-cases')}>View all</button>
          </div>
        }>
          <ul className="space-y-2">
            {cases.slice(0,2).map(cc => (
              <li key={cc.id}>
                <button onClick={() => navigate('/court-cases')} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-800 truncate">{cc.caseNumber}</div>
                  <div className="text-xs text-gray-600">{new Date(cc.date).toLocaleDateString()} • {cc.subject}</div>
                </button>
              </li>
            ))}
            {cases.length === 0 && <li className="text-sm text-gray-500">No court cases.</li>}
          </ul>
        </Card>
        </StaggerItem>
      </StaggerContainer>

      <div className="flex gap-2 flex-wrap">
        {(['events','manuals','circulars','forum','court-cases','suggestions','members'] as const).map(k => (
          <button key={k} onClick={()=>setTab(k)} className={`px-3 py-1.5 rounded-md text-sm border ${tab===k? 'bg-[var(--primary)] text-white border-gray-900':'bg-white text-[var(--primary)]'}`}>{k[0].toUpperCase()+k.slice(1)}</button>
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
    <div className="space-y-4">
      <div className="rounded-md border bg-white p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Division</label>
          <select className="block w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-[var(--primary)]" value={division} onChange={async(e)=>{ await onDivisionChange(e.target.value as Division | ''); }}>
            <option value="">All divisions</option>
            {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <Button onClick={()=> onReload(division)}>Refresh</Button>
      </div>

      {/* Save All Changes Bar */}
      {hasChanges && (
        <div className="rounded-md border-2 border-[var(--accent)] bg-yellow-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--primary)]">
              You have unsaved changes for {Object.keys(editing).length} member{Object.keys(editing).length > 1 ? 's' : ''}
            </span>
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
      )}

      <div className="rounded-md border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Designation</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Division</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Department</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Membership</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Role</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map(u => {
              const e = editing[u.id] || {}
              const hasRowChanges = !!editing[u.id]
              return (
                <tr key={u.id} className={`border-t ${hasRowChanges ? 'bg-yellow-50' : ''}`}>
                  <td className="px-3 py-2">
                    <input className="w-40 rounded-md border border-gray-300 px-2 py-1 text-sm" value={(e.name ?? u.name) as string} onChange={(ev)=> setEdit(u.id, { name: ev.target.value })} />
                  </td>
                  <td className="px-3 py-2 text-gray-600">{u.email}</td>
                  <td className="px-3 py-2">
                    <input className="w-40 rounded-md border border-gray-300 px-2 py-1 text-sm" value={(e.designation ?? u.designation) as string} onChange={(ev)=> setEdit(u.id, { designation: ev.target.value })} />
                  </td>
                  <td className="px-3 py-2">
                    <select className="w-36 rounded-md border border-gray-300 px-2 py-1 text-sm" value={(e.division ?? u.division) as string} onChange={(ev)=> setEdit(u.id, { division: ev.target.value as Division })}>
                      <option value="">Select…</option>
                      {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input className="w-40 rounded-md border border-gray-300 px-2 py-1 text-sm" value={(e.department ?? u.department) as string} onChange={(ev)=> setEdit(u.id, { department: ev.target.value })} />
                  </td>
                  <td className="px-3 py-2">
                    <select className="w-36 rounded-md border border-gray-300 px-2 py-1 text-sm" value={(e.membershipType ?? u.membershipType) as string} onChange={(ev)=> setEdit(u.id, { membershipType: ev.target.value as MemberUser['membershipType'] })}>
                      {['None','Ordinary','Lifetime'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select className="w-28 rounded-md border border-gray-300 px-2 py-1 text-sm" value={(e.role ?? u.role) as string} onChange={(ev)=> setEdit(u.id, { role: ev.target.value as 'admin'|'member' })}>
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    {hasRowChanges && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[var(--accent)]">Modified</span>
                        <button 
                          className="text-xs text-gray-600 hover:text-gray-900 underline"
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
                <td className="px-3 py-6 text-sm text-gray-600" colSpan={8}>No members found for selected filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Save All Changes Bar */}
      {hasChanges && (
        <div className="rounded-md border-2 border-[var(--accent)] bg-yellow-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--primary)]">
              You have unsaved changes for {Object.keys(editing).length} member{Object.keys(editing).length > 1 ? 's' : ''}
            </span>
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
      )}
    </div>
  )
}

function EventsAdmin({ data, onChange }: { data: EventItem[]; onChange: (d: EventItem[])=>void }){
  const [form, setForm] = useState<Omit<EventItem,'id'>>({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input label="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
          <Input label="Date" type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
          <Input label="Location" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} />
        </div>
        <Input label="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
        <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={!!form.breaking} onChange={(e)=>setForm({...form, breaking:e.target.checked})}/> Breaking</label>
        <Button onClick={async()=>{ const created = await createEvent(form); onChange([...data, created]); setForm({ title:'', date:'', location:'', description:'', photos:[], breaking:false }) }}>Add Event</Button>
      </div>
      <div className="rounded-md border bg-white divide-y">
        {data.map(e=> (
          <div key={e.id} className="p-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">{e.title}</div>
              <div className="text-xs text-gray-600">{e.date} • {e.location} {e.breaking ? '• Breaking' : ''}</div>
            </div>
            <Button variant="secondary" onClick={async()=>{ const upd = await updateEvent(e.id,{ breaking: !e.breaking }); onChange(data.map(d=>d.id===e.id?upd:d)) }}>Toggle Breaking</Button>
            <Button variant="danger" onClick={async()=>{ await deleteEvent(e.id); onChange(data.filter(d=>d.id!==e.id)) }}>Delete</Button>
          </div>
        ))}
        {data.length===0 && <div className="p-4 text-sm text-gray-600">No events.</div>}
      </div>
    </div>
  )
}

function ManualsAdmin({ data, onChange }: { data: Manual[]; onChange: (d: Manual[])=>void }){
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white p-4 space-y-3">
        <Input label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="URL (optional)" value={url} onChange={(e)=>setUrl(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or Image)</label>
            <input type="file" accept="application/pdf,image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
            <div className="text-xs text-gray-500 mt-1">Provide either a URL or upload a file.</div>
          </div>
        </div>
        <Button onClick={async()=>{
          const m = await createManual({ title, url, file: file || undefined });
          onChange([...data, m]);
          setTitle(''); setUrl(''); setFile(null);
        }}>Add Manual</Button>
      </div>
      <div className="rounded-md border bg-white divide-y">
        {data.map(m=> (
          <div key={m.id} className="p-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">{m.title}</div>
              {m.url && <div className="text-xs text-[var(--primary)]"><a className="underline" href={m.url} target="_blank" rel="noreferrer">Open</a></div>}
            </div>
            <Button variant="secondary" onClick={async()=>{ const upd = await updateManual(m.id,{ title: m.title + ' (Updated)' }); onChange(data.map(d=>d.id===m.id?upd:d)) }}>Quick Update</Button>
            <Button variant="danger" onClick={async()=>{ await deleteManual(m.id); onChange(data.filter(d=>d.id!==m.id)) }}>Delete</Button>
          </div>
        ))}
        {data.length===0 && <div className="p-4 text-sm text-gray-600">No manuals.</div>}
      </div>
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
    <div className="space-y-4">
      <div className="rounded-md border bg-white p-4 space-y-3">
        <Input label="Board Number" value={boardNumber} onChange={(e)=>setBoardNumber(e.target.value)} />
        <Input label="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
        <Input label="Date of Issue" type="date" value={dateOfIssue} onChange={(e)=>setDateOfIssue(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="URL (optional)" value={url} onChange={(e)=>setUrl(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or Image)</label>
            <input type="file" accept="application/pdf,image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
            <div className="text-xs text-gray-500 mt-1">Provide either a URL or upload a file.</div>
          </div>
        </div>
        <Button onClick={async()=>{ const c = await createCircular({ boardNumber, subject, dateOfIssue, url, file: file || undefined }); onChange([...data, c]); setBoardNumber(''); setSubject(''); setDateOfIssue(''); setUrl(''); setFile(null) }}>Add Circular</Button>
      </div>
      <div className="rounded-md border bg-white divide-y">
        {data.map(c=> (
          <div key={c.id} className="p-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">{c.subject}</div>
              <div className="text-xs text-gray-600">{c.boardNumber} • {c.dateOfIssue}</div>
              {c.url && <div className="text-xs text-[var(--primary)]"><a className="underline" href={c.url} target="_blank" rel="noreferrer">Open</a></div>}
            </div>
            <Button variant="secondary" onClick={async()=>{ const upd = await updateCircular(c.id,{ subject: c.subject + ' (Updated)' }); onChange(data.map(d=>d.id===c.id?upd:d)) }}>Quick Update</Button>
            <Button variant="danger" onClick={async()=>{ await deleteCircular(c.id); onChange(data.filter(d=>d.id!==c.id)) }}>Delete</Button>
          </div>
        ))}
        {data.length===0 && <div className="p-4 text-sm text-gray-600">No circulars.</div>}
      </div>
    </div>
  )
}

function ForumAdmin({ data, onChange }: { data: ForumTopic[]; onChange: (d: ForumTopic[])=>void }){
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('Admin')
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white p-4 space-y-3">
        <Input label="Topic Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <Input label="Author" value={author} onChange={(e)=>setAuthor(e.target.value)} />
        <Button onClick={async()=>{ const t = await createForumTopic({ title, author }); onChange([t, ...data]); setTitle('') }}>Add Topic</Button>
      </div>
      <div className="rounded-md border bg-white divide-y">
        {data.map(t => (
          <div key={t.id} className="p-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-gray-600">By {t.author} • {new Date(t.createdAt).toLocaleDateString()} • {t.replies} replies</div>
            </div>
            <Button variant="secondary" onClick={async()=>{ const upd = await updateForumTopic(t.id,{ title: t.title + ' (Updated)' }); onChange(data.map(d=>d.id===t.id?upd:d)) }}>Quick Update</Button>
            <Button variant="danger" onClick={async()=>{ await deleteForumTopic(t.id); onChange(data.filter(d=>d.id!==t.id)) }}>Delete</Button>
          </div>
        ))}
        {data.length===0 && <div className="p-4 text-sm text-gray-600">No topics.</div>}
      </div>
    </div>
  )
}

function CourtCasesAdmin({ data, onChange }: { data: CourtCase[]; onChange: (d: CourtCase[])=>void }){
  const [caseNumber, setCaseNumber] = useState('')
  const [date, setDate] = useState('')
  const [subject, setSubject] = useState('')
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white p-4 space-y-3">
        <Input label="Case Number" value={caseNumber} onChange={(e)=>setCaseNumber(e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Date" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          <Input label="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
        </div>
        <Button onClick={async()=>{ const cc = await createCourtCase({ caseNumber, date, subject }); onChange([cc, ...data]); setCaseNumber(''); setDate(''); setSubject('') }}>Add Case</Button>
      </div>
      <div className="rounded-md border bg-white divide-y">
        {data.map(c => (
          <div key={c.id} className="p-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium">{c.caseNumber}</div>
              <div className="text-xs text-gray-600">{new Date(c.date).toLocaleDateString()} • {c.subject}</div>
            </div>
            <Button variant="secondary" onClick={async()=>{ const upd = await updateCourtCase(c.id,{ subject: c.subject + ' (Updated)' }); onChange(data.map(d=>d.id===c.id?upd:d)) }}>Quick Update</Button>
            <Button variant="danger" onClick={async()=>{ await deleteCourtCase(c.id); onChange(data.filter(d=>d.id!==c.id)) }}>Delete</Button>
          </div>
        ))}
        {data.length===0 && <div className="p-4 text-sm text-gray-600">No court cases.</div>}
      </div>
    </div>
  )
}

function SuggestionsAdmin({ data }: { data: Suggestion[] }){
  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        {data.length===0 && <div className="p-4 text-sm text-gray-600">No suggestions submitted yet.</div>}
        {data.map(s => (
          <div key={s.id} className="p-4 border-b last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">{new Date(s.createdAt).toLocaleString()}</div>
              <div className="text-sm font-medium text-[var(--primary)]">{s.userName} ({s.userId})</div>
            </div>
            <p className="mt-2 text-gray-800 whitespace-pre-wrap">{s.text}</p>
            {s.fileNames?.length>0 && (
              <div className="mt-2 text-xs text-gray-600">Attachments: {s.fileNames.join(', ')}</div>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500">Note: Files are not uploaded in this mock; only filenames are stored.</div>
    </div>
  )
}
