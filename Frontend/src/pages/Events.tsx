import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '../animations'
import { getEvents, createEvent } from '../services/api'
import type { EventItem } from '../types'
import Button from '../components/Button'
import Modal from '../components/Modal'
import SegmentedControl from '../components/SegmentedControl'
import Calendar from '../components/Calendar'
import Spinner from '../components/Spinner'
import { StaggerContainer, StaggerItem } from '../components/StaggerAnimation'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'
import Input from '../components/Input'

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [openImg, setOpenImg] = useState<string | null>(null)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [view, setView] = useState<'list'|'calendar'>('list')
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<EventItem,'id'>>({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
  usePageTitle('CREA • Events')

  useEffect(() => { getEvents().then((d)=>{ setEvents(d); setLoading(false) }) }, [])

  const breaking = useMemo(() => events.find((e) => e.breaking), [events])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-blue-900">Events</h1>

      {breaking && (
        <motion.div 
          className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING.entrance}
        >
          <strong>Breaking News:</strong> {breaking.title} on {new Date(breaking.date).toLocaleDateString()} at {breaking.location}
        </motion.div>
      )}

      <div className="flex items-center justify-between gap-3">
        {isAdmin && <Button onClick={() => setOpenCreate(true)}>Schedule New Event</Button>}
        <SegmentedControl options={[{label:'List', value:'list'},{label:'Calendar', value:'calendar'}]} value={view} onChange={setView} />
      </div>
      {loading ? (
        <div className="flex justify-center py-10"><Spinner size={60} /></div>
      ) : view==='list' ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e) => (
            <StaggerItem key={e.id}>
              <motion.div 
                className="rounded-lg border bg-white p-4 shadow-sm"
                whileHover={{ y: -1, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)", transition: SPRING.hover }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{e.title}</h3>
                  <span className="text-xs text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">{e.location}</div>
                <p className="mt-2 text-sm text-gray-700">{e.description}</p>
                {e.photos?.length ? (
                  <div className="mt-3 flex gap-3 overflow-x-auto">
                    {e.photos.map((p, idx) => (
                      <img key={idx} src={p} alt="event" className="h-24 w-36 rounded-md object-cover cursor-pointer" onClick={() => setOpenImg(p)} />
                    ))}
                  </div>
                ) : null}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <Calendar year={new Date().getFullYear()} month={new Date().getMonth()} markers={events.map(e=>e.date)} />
      )}

  <Modal open={!!openImg} onClose={() => setOpenImg(null)}>
        {openImg && <img src={openImg} alt="preview" className="w-full rounded" />}
      </Modal>

      {/* Create Event Modal */}
      <Modal open={openCreate} onClose={() => { if (!creating) setOpenCreate(false) }}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-blue-900">Schedule New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
            <Input label="Date" type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
          </div>
          <Input label="Location" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} />
          <Input label="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
          <label className="text-sm inline-flex items-center gap-2"><input type="checkbox" checked={!!form.breaking} onChange={(e)=>setForm({...form, breaking:e.target.checked})}/> Mark as Breaking</label>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={()=>!creating && setOpenCreate(false)} disabled={creating}>Cancel</Button>
            <Button onClick={async()=>{
              if (!form.title || !form.date) { alert('Title and Date are required'); return }
              try {
                setCreating(true)
                const created = await createEvent(form)
                setEvents(prev => [created, ...prev])
                setForm({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
                setOpenCreate(false)
              } catch (e) {
                alert((e as Error).message || 'Failed to create event')
              } finally {
                setCreating(false)
              }
            }} disabled={creating} loading={creating}>{creating ? 'Saving...' : 'Create Event'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
