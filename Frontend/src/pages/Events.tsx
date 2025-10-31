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
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--primary)]">Events</h1>
          <p className="text-gray-600 mt-1">Stay updated with our latest activities and gatherings</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setOpenCreate(true)}>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Schedule New Event
                </span>
              </Button>
            </motion.div>
          )}
          <SegmentedControl 
            options={[
              {label:'List', value:'list'},
              {label:'Calendar', value:'calendar'}
            ]} 
            value={view} 
            onChange={setView} 
          />
        </div>
      </div>

      {/* Breaking News Alert */}
      {breaking && (
        <motion.div 
          className="relative rounded-xl border-2 border-[var(--accent)] bg-gradient-to-r from-yellow-50 to-orange-50 p-5 overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING.entrance}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold uppercase">Breaking News</span>
                <span className="text-xs text-gray-600">{new Date(breaking.date).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900">{breaking.title}</h3>
              <p className="text-sm text-gray-700 mt-1">📍 {breaking.location}</p>
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={60} />
        </div>
      ) : view === 'list' ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((e, index) => (
            <StaggerItem key={e.id}>
              <motion.div 
                className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                whileHover={{ y: -4, transition: SPRING.hover }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/5 to-transparent rounded-full blur-2xl -mr-16 -mt-16 group-hover:from-[var(--primary)]/10 transition-all duration-300" />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[var(--primary)] group-hover:text-blue-700 transition-colors">{e.title}</h3>
                      {e.breaking && (
                        <span className="inline-block mt-2 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                          ⚡ Breaking
                        </span>
                      )}
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0 ml-3 shadow-md">
                      <span className="text-xs font-medium">{new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-2xl font-bold leading-none">{new Date(e.date).getDate()}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-3 text-gray-600">
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">{e.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{e.description}</p>

                  {/* Photos */}
                  {e.photos?.length ? (
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                      {e.photos.map((p, idx) => (
                        <motion.img 
                          key={idx} 
                          src={p} 
                          alt={`Event photo ${idx + 1}`}
                          className="h-28 w-40 rounded-lg object-cover cursor-pointer border-2 border-gray-100 hover:border-[var(--accent)] transition-all flex-shrink-0" 
                          onClick={() => setOpenImg(p)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        />
                      ))}
                    </div>
                  ) : null}

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
          
          {events.length === 0 && (
            <div className="col-span-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
              >
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
                <p className="text-gray-600">Check back later for upcoming events</p>
              </motion.div>
            </div>
          )}
        </StaggerContainer>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Calendar
            year={new Date().getFullYear()}
            month={new Date().getMonth()}
            markers={events.map(e => ({ 
              date: e.date, 
              title: e.title, 
              content: e.description,
              type: e.location 
            }))}
          />
        </div>
      )}

  <Modal open={!!openImg} onClose={() => setOpenImg(null)}>
        {openImg && <img src={openImg} alt="preview" className="w-full rounded" />}
      </Modal>

      {/* Create Event Modal */}
      <Modal open={openCreate} onClose={() => { if (!creating) setOpenCreate(false) }}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--primary)]">Schedule New Event</h2>
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
