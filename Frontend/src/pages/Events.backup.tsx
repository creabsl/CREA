import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Grid, List, Filter, Search, Plus, MapPin, Clock, Users } from 'lucide-react'
import { getEvents, createEvent } from '../services/api'
import type { EventItem } from '../types'
import Button from '../components/Button'
import Modal from '../components/Modal'
import SegmentedControl from '../components/SegmentedControl'
import CalendarComponent from '../components/Calendar'
import Spinner from '../components/Spinner'
import Card from '../components/Card'
import { StaggerContainer, StaggerItem } from '../components/StaggerAnimation'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'
import Input from '../components/Input'

type ViewMode = 'grid' | 'list' | 'calendar'
type FilterMode = 'all' | 'upcoming' | 'past' | 'breaking'

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [openImg, setOpenImg] = useState<string | null>(null)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [view, setView] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<EventItem,'id'>>({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
  usePageTitle('CREA • Events')

  useEffect(() => { getEvents().then((d)=>{ setEvents(d); setLoading(false) }) }, [])

  const breaking = useMemo(() => events.find((e) => e.breaking), [events])

  const filteredEvents = useMemo(() => {
    let filtered = events
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Apply filter
    switch (filter) {
      case 'upcoming':
        filtered = events.filter(e => new Date(e.date) >= today)
        break
      case 'past':
        filtered = events.filter(e => new Date(e.date) < today)
        break
      case 'breaking':
        filtered = events.filter(e => e.breaking)
        break
      default:
        filtered = events
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [events, filter, searchQuery])

  const viewOptions = [
    { label: 'Grid', value: 'grid' as ViewMode, icon: <Grid className="h-4 w-4" /> },
    { label: 'List', value: 'list' as ViewMode, icon: <List className="h-4 w-4" /> },
    { label: 'Calendar', value: 'calendar' as ViewMode, icon: <Calendar className="h-4 w-4" /> }
  ]

  const filterOptions = [
    { label: 'All Events', value: 'all' as FilterMode },
    { label: 'Upcoming', value: 'upcoming' as FilterMode },
    { label: 'Past Events', value: 'past' as FilterMode },
    { label: 'Breaking', value: 'breaking' as FilterMode }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with railway engineering events and announcements
          </p>
        </div>
        
        {isAdmin && (
          <Button 
            variant="navy" 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setOpenCreate(true)}
          >
            Schedule New Event
          </Button>
        )}
      </div>

      {/* Breaking News Banner */}
      {breaking && (
        <motion.div 
          className="relative overflow-hidden rounded-xl border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-orange-50 shadow-professional"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"></div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center text-white animate-pulse">
                  <span className="font-bold">!</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    BREAKING NEWS
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(breaking.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{breaking.title}</h3>
                <p className="text-gray-700">
                  Event scheduled at <span className="font-semibold text-[var(--primary)]">{breaking.location}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Controls */}
      <Card variant="professional" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events, locations, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterMode)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {viewOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setView(option.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    view === option.value
                      ? 'bg-white text-[var(--primary)] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.icon}
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredEvents.length} of {events.length} events
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <span>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </Card>
      {/* Events Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-6">
          {view === 'calendar' ? (
            <Card variant="professional" className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Calendar</h3>
                <CalendarComponent 
                  year={new Date().getFullYear()} 
                  month={new Date().getMonth()} 
                  markers={events.map(e => e.date)} 
                />
              </div>
            </Card>
          ) : view === 'list' ? (
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="professional" className="hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-[var(--primary)]" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            </div>
                            <p className="text-gray-700 mt-2">{event.description}</p>
                          </div>
                          
                          {event.breaking && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              BREAKING
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <StaggerItem key={event.id}>
                  <Card 
                    variant="professional" 
                    className="h-full hover:shadow-lg transition-all duration-300"
                    delay={index * 0.1}
                  >
                    <div className="space-y-4">
                      {/* Event Image Placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-[var(--primary)]100 to-[var(--primary)]50 rounded-lg flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-[var(--primary)]" />
                      </div>
                      
                      {/* Event Content */}
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {event.title}
                          </h3>
                          {event.breaking && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                              LIVE
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Button variant="outline" size="sm" fullWidth>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {filteredEvents.length === 0 && (
            <Card variant="professional" className="text-center py-12">
              <div className="space-y-4">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No events found</h3>
                  <p className="text-gray-600 mt-1">
                    {searchQuery 
                      ? `No events match your search for "${searchQuery}"`
                      : 'No events available for the selected filter.'
                    }
                  </p>
                </div>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Create Event Modal */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="Schedule New Event">
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault()
          setCreating(true)
          try {
            const newEvent = await createEvent(form)
            setEvents(prev => [...prev, newEvent])
            setOpenCreate(false)
            setForm({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
          } finally {
            setCreating(false)
          }
        }}>
          <Input 
            label="Event Title" 
            value={form.title} 
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            required 
          />
          <Input 
            label="Date" 
            type="date" 
            value={form.date} 
            onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
            required 
          />
          <Input 
            label="Location" 
            value={form.location} 
            onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
            required 
          />
          <Input 
            label="Description" 
            value={form.description} 
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            required 
          />
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="breaking" 
              checked={form.breaking}
              onChange={(e) => setForm(prev => ({ ...prev, breaking: e.target.checked }))}
              className="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" 
            />
            <label htmlFor="breaking" className="text-sm font-medium text-gray-700">
              Mark as breaking news
            </label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpenCreate(false)} fullWidth>
              Cancel
            </Button>
            <Button type="submit" loading={creating} fullWidth>
              Schedule Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* Image Modal */}
      <Modal open={!!openImg} onClose={() => setOpenImg(null)} title="Event Photo">
        {openImg && (
          <div className="text-center">
            <img src={openImg} alt="Event" className="max-w-full max-h-96 rounded-lg mx-auto" />
          </div>
        )}
      </Modal>
    </div>
  )
}
        <div className="flex justify-center py-10"><Spinner size={60} /></div>
      ) : view==='list' ? (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e) => (
            <StaggerItem key={e.id}>
              <motion.div 
                className="rounded-lg border bg-white p-4 shadow-sm"
                whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
            }} disabled={creating}>{creating ? 'Saving...' : 'Create Event'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
