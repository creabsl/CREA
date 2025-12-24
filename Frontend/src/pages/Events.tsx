import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getEvents, createEvent } from '../services/api'
import type { EventItem } from '../types'
import Button from '../components/Button'
import Modal from '../components/Modal'
import SegmentedControl from '../components/SegmentedControl'
import Spinner from '../components/Spinner'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'
import { useAdvertisements } from '../context/AdvertisementContext'
import Input from '../components/Input'
import FileUploader from '../components/FileUploader'

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [openImg, setOpenImg] = useState<string | null>(null)
  const { user } = useAuth()
  const { activeAdvertisements, addAdvertisement, removeAdvertisement, dismissAdvertisement } = useAdvertisements()
  const isAdmin = user?.role === 'admin'
  const [eventType, setEventType] = useState<'upcoming'|'completed'>('upcoming')
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<EventItem,'id'>>({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
  const [openAdModal, setOpenAdModal] = useState(false)
  const [adForm, setAdForm] = useState({ image: '', link: '', startDate: '', endDate: '' })
  usePageTitle('CREA • Events')

  useEffect(() => { getEvents().then((d)=>{ setEvents(d.filter(e => !e.breaking)); setLoading(false) }) }, [])

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])
  
  const displayedEvents = useMemo(() => {
    const sorted = [...events].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    if (eventType === 'upcoming') {
      return sorted.filter(e => new Date(e.date) >= today)
    } else {
      return sorted.filter(e => new Date(e.date) < today).reverse()
    }
  }, [events, eventType, today])

  // Get all event photos for gallery
  const allPhotos = useMemo(() => {
    const photos: { src: string; title: string; date: string }[] = []
    events.forEach(event => {
      if (event.photos && event.photos.length > 0) {
        event.photos.forEach(photo => {
          photos.push({
            src: photo,
            title: event.title,
            date: event.date
          })
        })
      }
    })
    return photos.slice(0, 12) // Show latest 12 photos
  }, [events])

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="bg-blue-50 px-5 py-3 border-b border-gray-200">
            <h1 className="text-xl font-bold text-[var(--primary)]">CREA Events</h1>
          </div>
          <div className="p-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-sm text-gray-600">
                Stay updated with upcoming events and browse past event archives
              </p>
              {isAdmin && (
                <Button 
                  onClick={() => setOpenCreate(true)}
                  className="whitespace-nowrap"
                >
                  Schedule Event
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Events List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Type Selector */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <SegmentedControl
                options={[
                  { label: 'Upcoming Events', value: 'upcoming' },
                  { label: 'Completed Events', value: 'completed' }
                ]}
                value={eventType}
                onChange={(v) => setEventType(v as 'upcoming'|'completed')}
              />
            </div>

            {/* Events List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-4">
                {displayedEvents.map((e, index) => {
                  const isCompleted = new Date(e.date) < today
                  return (
                    <div key={e.id}>
                      <motion.div 
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {/* Event Header */}
                        <div className={`px-5 py-3 border-b border-gray-200 ${isCompleted ? 'bg-gray-50' : 'bg-blue-50'}`}>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className={`text-lg font-bold ${isCompleted ? 'text-gray-700' : 'text-[var(--primary)]'}`}>
                              {e.title}
                            </h3>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="p-5">
                          {/* Date and Location */}
                          <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">
                                {new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium">{e.location}</span>
                            </div>
                          </div>

                          {/* Description */}
                          {e.description && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {e.description}
                              </p>
                            </div>
                          )}

                          {/* Photos Gallery */}
                          {e.photos && e.photos.length > 0 && (
                            <div className="border-t border-gray-200 pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold uppercase text-gray-600 flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Event Photos
                                </h4>
                                <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                                  {e.photos.length} {e.photos.length === 1 ? 'Photo' : 'Photos'}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {e.photos.map((p, idx) => (
                                  <motion.div
                                    key={idx}
                                    className="relative aspect-square rounded overflow-hidden bg-gray-100 cursor-pointer border border-gray-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setOpenImg(p)}
                                  >
                                    <img 
                                      src={p} 
                                      alt={`Event photo ${idx + 1}`}
                                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Advertisement after first event */}
                      {index === 0 && activeAdvertisements.length > 0 && (
                        <motion.div 
                          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="bg-orange-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-base font-bold text-[var(--accent)]">Featured Advertisement</h3>
                            <div className="flex items-center gap-2">
                              {!isAdmin && (
                                <button
                                  onClick={() => dismissAdvertisement(activeAdvertisements[0].id)}
                                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                                  title="Dismiss this ad"
                                >
                                  × Close
                                </button>
                              )}
                              {isAdmin && (
                                <button
                                  onClick={() => removeAdvertisement(activeAdvertisements[0].id)}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="p-4">
                            {activeAdvertisements[0].link ? (
                              <a href={activeAdvertisements[0].link} target="_blank" rel="noopener noreferrer" className="block">
                                <img 
                                  src={activeAdvertisements[0].image} 
                                  alt="Advertisement" 
                                  className="w-full rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                />
                              </a>
                            ) : (
                              <img 
                                src={activeAdvertisements[0].image} 
                                alt="Advertisement" 
                                className="w-full rounded-lg"
                              />
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Admin: Add Advertisement button after first event if no ad exists */}
                      {index === 0 && activeAdvertisements.length === 0 && isAdmin && (
                        <motion.div 
                          className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 overflow-hidden mt-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="p-8 text-center">
                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Add Advertisement</h3>
                            <p className="text-xs text-gray-500 mb-4">Click to add a featured advertisement between events</p>
                            <Button onClick={() => setOpenAdModal(true)} className="text-sm">
                              Upload Advertisement
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )
                })}

                {displayedEvents.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-base font-semibold text-gray-700 mb-1">
                      {eventType === 'upcoming' ? 'No Upcoming Events' : 'No Completed Events'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {eventType === 'upcoming' ? 'Check back later for upcoming events' : 'Past events will appear here'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Photo Gallery & Advertisements */}
          <div className="space-y-6">
            {/* Photo Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="bg-orange-50 px-5 py-3 border-b border-gray-200">
                <h2 className="text-base font-bold text-[var(--accent)]">Event Gallery</h2>
              </div>
              <div className="p-4">
                {allPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {allPhotos.map((photo, idx) => (
                      <motion.div
                        key={idx}
                        className="relative aspect-square rounded overflow-hidden bg-gray-100 cursor-pointer border border-gray-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOpenImg(photo.src)}
                      >
                        <img 
                          src={photo.src} 
                          alt={photo.title}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">No photos available yet</p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal open={!!openImg} onClose={() => setOpenImg(null)}>
        {openImg && (
          <div className="max-w-4xl mx-auto">
            <img src={openImg} alt="preview" className="w-full rounded-lg" />
          </div>
        )}
      </Modal>

      {/* Create Event Modal */}
      <Modal open={openCreate} onClose={() => { if (!creating) setOpenCreate(false) }}>
        <div className="space-y-4">
          <div className="bg-blue-50 px-5 py-3 rounded-lg -m-6 mb-4">
            <h2 className="text-lg font-bold text-[var(--primary)]">Schedule New Event</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
            <Input label="Date" type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
          </div>
          <Input label="Location" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} />
          <Input label="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
          <label className="text-sm inline-flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={!!form.breaking} 
              onChange={(e)=>setForm({...form, breaking:e.target.checked})}
              className="rounded border-gray-300"
            />
            Mark as Breaking
          </label>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={()=>!creating && setOpenCreate(false)} disabled={creating}>
              Cancel
            </Button>
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
            }} disabled={creating} loading={creating}>
              {creating ? 'Saving...' : 'Create Event'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Advertisement Modal */}
      <Modal open={openAdModal} onClose={() => setOpenAdModal(false)}>
        <div className="space-y-4">
          <div className="bg-orange-50 px-5 py-3 rounded-lg -m-6 mb-4">
            <h2 className="text-lg font-bold text-[var(--accent)]">Upload Advertisement</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Advertisement Image</label>
            <FileUploader
              onFiles={(files) => {
                if (files.length > 0) {
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setAdForm({...adForm, image: reader.result as string})
                  }
                  reader.readAsDataURL(files[0])
                }
              }}
              maxFiles={1}
              accept=".jpg,.jpeg,.png,.webp"
            />
          </div>

          {adForm.image && (
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
              <img 
                src={adForm.image} 
                alt="Ad preview" 
                className="w-full rounded-lg"
              />
            </div>
          )}

          <Input 
            label="Link URL (Optional)" 
            value={adForm.link} 
            onChange={(e)=>setAdForm({...adForm, link:e.target.value})}
            placeholder="https://example.com/link"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="Start Date" 
              type="date"
              value={adForm.startDate} 
              onChange={(e)=>setAdForm({...adForm, startDate:e.target.value})}
            />
            <Input 
              label="End Date" 
              type="date"
              value={adForm.endDate} 
              onChange={(e)=>setAdForm({...adForm, endDate:e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => {
              setAdForm({ image: '', link: '', startDate: '', endDate: '' })
              setOpenAdModal(false)
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (!adForm.image) { alert('Please upload an image'); return }
              if (!adForm.startDate || !adForm.endDate) { alert('Please select start and end dates'); return }
              if (new Date(adForm.startDate) > new Date(adForm.endDate)) { alert('End date must be after start date'); return }
              
              addAdvertisement({
                image: adForm.image,
                link: adForm.link || undefined,
                startDate: adForm.startDate,
                endDate: adForm.endDate
              })
              setAdForm({ image: '', link: '', startDate: '', endDate: '' })
              setOpenAdModal(false)
            }}>
              Upload Advertisement
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
