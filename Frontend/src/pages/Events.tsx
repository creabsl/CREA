import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '../animations'
import { getEvents, createEvent } from '../services/api'
import type { EventItem } from '../types'
import Button from '../components/Button'
import Modal from '../components/Modal'
import SegmentedControl from '../components/SegmentedControl'
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
  const [eventType, setEventType] = useState<'upcoming'|'completed'>('upcoming')
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<EventItem,'id'>>({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
  usePageTitle('CREA • Events')

  useEffect(() => { getEvents().then((d)=>{ setEvents(d.filter(e => !e.breaking)); setLoading(false) }) }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const upcomingEvents = useMemo(() => events.filter((e) => !e.breaking && new Date(e.date) >= today), [events, today])
  const completedEvents = useMemo(() => events.filter((e) => !e.breaking && new Date(e.date) < today), [events, today])
  
  const displayedEvents = eventType === 'upcoming' ? upcomingEvents : completedEvents

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section with Gradient */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] via-[#1a4d8f] to-[var(--primary)] p-8 text-white shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold !text-white">Events</h1>
                  <p className="text-white/80 text-sm mt-1">Stay updated with our latest activities and gatherings</p>
                </div>
              </div>
            </div>
            {isAdmin && (
              <Button 
                onClick={() => setOpenCreate(true)}
                variant="secondary"
                className="bg-white !text-[var(--primary)] hover:bg-white/90 shadow-lg font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Schedule Event
              </Button>
            )}
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Event Type Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2">
        <SegmentedControl 
          options={[
            {label: `Upcoming Events (${upcomingEvents.length})`, value:'upcoming'},
            {label: `Completed Events (${completedEvents.length})`, value:'completed'}
          ]} 
          value={eventType} 
          onChange={setEventType} 
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={60} />
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-6">
          {displayedEvents.map((e, index) => {
            const isCompleted = new Date(e.date) < today
            return (
            <StaggerItem key={e.id}>
              <motion.div 
                className={`group relative rounded-3xl ${isCompleted ? 'bg-white border-2 border-slate-200 shadow-lg' : 'bg-white border-2 border-blue-100 shadow-md'} overflow-hidden hover:shadow-2xl transition-all duration-300`}
                whileHover={{ y: -4, transition: SPRING.hover }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Top decorative banner */}
                {isCompleted && (
                  <div className="h-2 bg-gradient-to-r from-slate-500 via-gray-600 to-slate-700"></div>
                )}
                {!isCompleted && (
                  <div className="h-2 bg-gradient-to-r from-[var(--primary)] via-blue-600 to-[var(--primary)]"></div>
                )}
                
                <div className="p-8">
                  {/* Header with badge */}
                  <div className="mb-6">
                    {isCompleted && (
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-600 to-gray-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg mb-4">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </div>
                    )}
                    
                    <h3 className={`text-3xl md:text-4xl font-bold ${isCompleted ? 'text-slate-900' : 'text-[var(--primary)]'} mb-5 leading-tight`}>
                      {e.title}
                    </h3>
                    
                    {/* Date and Location row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl ${isCompleted ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-700'} flex-1`}>
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold text-sm">
                          {new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl ${isCompleted ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-700'} flex-1`}>
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold text-sm">{e.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {e.description && (
                    <div className={`mb-7 p-6 rounded-2xl ${isCompleted ? 'bg-slate-50/80 border-2 border-slate-200' : 'bg-blue-50/40 border-2 border-blue-100'}`}>
                      <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isCompleted ? 'text-slate-600' : 'text-blue-700'} flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Event Details
                      </h4>
                      <p className={`text-base ${isCompleted ? 'text-slate-700' : 'text-gray-800'} leading-relaxed whitespace-pre-line`}>
                        {e.description}
                      </p>
                    </div>
                  )}

                  {/* Photos Gallery */}
                  {e.photos?.length > 0 ? (
                    <div className={`p-7 rounded-2xl ${isCompleted ? 'bg-slate-50/80 border-2 border-slate-200' : 'bg-blue-50/40 border-2 border-blue-100'}`}>
                      <div className="flex items-center justify-between mb-5">
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-slate-600' : 'text-blue-700'} flex items-center gap-2`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Event Photos
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCompleted ? 'bg-slate-200 text-slate-700' : 'bg-blue-100 text-blue-700'}`}>
                          {e.photos.length} {e.photos.length === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {e.photos.map((p, idx) => (
                          <motion.div
                            key={idx}
                            className="relative group/photo aspect-square rounded-xl overflow-hidden shadow-md cursor-pointer bg-gray-100"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setOpenImg(p)}
                          >
                            <img 
                              src={p} 
                              alt={`Event photo ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover/photo:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-90 group-hover/photo:scale-100 transition-transform">
                                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : isCompleted ? (
                    <div className="p-10 text-center bg-slate-50/80 border-2 border-dashed border-slate-300 rounded-2xl">
                      <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h5 className="text-lg font-bold text-slate-700 mb-2">No Photos Available</h5>
                      <p className="text-sm text-slate-500">Photos from this event will be published soon</p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </StaggerItem>
          )})}
          
          {displayedEvents.length === 0 && (
            <div className="col-span-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
              >
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {eventType === 'upcoming' ? 'No Upcoming Events' : 'No Completed Events'}
                </h3>
                <p className="text-gray-600">
                  {eventType === 'upcoming' ? 'Check back later for upcoming events' : 'Past events will appear here'}
                </p>
              </motion.div>
            </div>
          )}
        </StaggerContainer>
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
