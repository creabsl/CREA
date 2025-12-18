import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5001'

// Auto-rotating slideshow component for completed events
function AutoRotatingSlideshow({ photos, onImageClick }: { photos: string[], onImageClick: (url: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const photosPerView = 3

  // Helper function to get full image URL
  const getImageUrl = (photoPath: string) => {
    if (photoPath.startsWith('http')) return photoPath
    return `${API_URL}${photoPath}`
  }

  // If less than 3 photos, show static grid without carousel
  if (photos.length < 3) {
    return (
      <div className="relative">
        <div className="relative overflow-hidden rounded-xl shadow-md">
          <div className={`flex ${photos.length === 1 ? 'justify-center' : 'justify-between'} gap-3`}>
            {photos.map((photo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer group shadow-lg"
                style={{ 
                  width: photos.length === 1 ? '100%' : `calc((100% - 0.75rem) / 2)`,
                  aspectRatio: '4/3'
                }}
                onClick={() => onImageClick(photo)}
              >
                <img 
                  src={getImageUrl(photo)} 
                  alt={`Event photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 rounded-full p-2">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>

                {/* Photo number */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold">
                  {idx + 1}/{photos.length}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // For 3+ photos, use sliding carousel
  const extendedPhotos = [...photos, ...photos, ...photos]

  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isPaused])

  // Reset to middle section when reaching end for infinite effect
  useEffect(() => {
    if (currentIndex >= photos.length * 2) {
      setTimeout(() => {
        setCurrentIndex(photos.length)
      }, 700)
    } else if (currentIndex < photos.length) {
      setTimeout(() => {
        setCurrentIndex(photos.length)
      }, 700)
    }
  }, [currentIndex, photos.length])

  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => prev - 1)
  }

  const slidePercentage = (currentIndex * 100) / photosPerView

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Horizontal Sliding Container - Shows 3 photos */}
      <div className="relative overflow-hidden rounded-xl shadow-md">
        <div 
          className="flex gap-3 transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${slidePercentage}%)` }}
        >
          {extendedPhotos.map((photo, idx) => {
            const actualIndex = idx % photos.length
            return (
              <div
                key={`${idx}`}
                className="relative flex-shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 cursor-pointer group shadow-lg"
                style={{ width: `calc((100% - ${(photosPerView - 1) * 0.75}rem) / ${photosPerView})` }}
                onClick={() => onImageClick(photo)}
              >
                <img 
                  src={getImageUrl(photo)} 
                  alt={`Event photo ${actualIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 rounded-full p-2">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>

                {/* Photo number */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold">
                  {actualIndex + 1}/{photos.length}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-900 p-3 rounded-full shadow-xl opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous photos"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-900 p-3 rounded-full shadow-xl opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next photos"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {photos.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(photos.length + idx)}
            className={`transition-all duration-300 rounded-full ${
              (currentIndex % photos.length) === idx 
                ? 'w-8 h-2.5 bg-gray-900' 
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-500'
            }`}
            aria-label={`Go to photo ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const navigate = useNavigate()
  const [openImg, setOpenImg] = useState<string | null>(null)
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [eventType, setEventType] = useState<'upcoming'|'completed'>('upcoming')
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<EventItem,'id'>>({ title:'', date:'', location:'', description:'', photos:[], breaking:false })
  usePageTitle('CREA • Events')

  useEffect(() => { 
    getEvents().then((d)=>{ setEvents(d); setLoading(false) })
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Only exclude breaking news from upcoming events (show current breaking news on Dashboard)
  // But include all past events (including past breaking news) in completed events
  const upcomingEvents = useMemo(() => events.filter((e) => !e.breaking && new Date(e.date) >= today), [events, today])
  const completedEvents = useMemo(() => events.filter((e) => new Date(e.date) < today), [events, today])
  
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
                onClick={() => navigate('/admin?tab=events')}
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
        <StaggerContainer className={`grid ${eventType === 'upcoming' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
          {displayedEvents.map((e, index) => {
            const isCompleted = new Date(e.date) < today
            return (
            <StaggerItem key={e.id}>
              {isCompleted ? (
                // Professional Completed Event Card
                <motion.article 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Event Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 sm:px-8 py-5 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-md">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 leading-tight">
                            {e.title}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Event Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 sm:px-8 py-6">
                    {/* Meta Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{e.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {e.description && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <div className="w-1 h-5 bg-gradient-to-b from-slate-600 to-slate-700 rounded-full"></div>
                          About This Event
                        </h4>
                        <div className="pl-4 border-l-2 border-gray-200">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {e.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Photo Gallery Section */}
                    {e.photos?.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-1 h-5 bg-gradient-to-b from-slate-600 to-slate-700 rounded-full"></div>
                            Event Gallery
                          </h4>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {e.photos.length} {e.photos.length === 1 ? 'Photo' : 'Photos'}
                          </span>
                        </div>
                        <AutoRotatingSlideshow photos={e.photos} onImageClick={setOpenImg} />
                      </div>
                    )}

                    {!e.photos?.length && (
                      <div className="mt-6 text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">No Photos Available</h5>
                        <p className="text-xs text-gray-500">Photos will be added soon</p>
                      </div>
                    )}
                  </div>
                </motion.article>
              ) : (
                // Upcoming Event Card
                <motion.div 
                  className="group relative rounded-2xl bg-white border-2 border-blue-100 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  whileHover={{ y: -4, transition: SPRING.hover }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="h-1.5 bg-gradient-to-r from-[var(--primary)] via-blue-600 to-[var(--primary)]"></div>
                  
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {/* Header with title, date, and location - compact layout */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-[var(--primary)] mb-2">
                        {e.title}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-2 text-sm">
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {e.location}
                        </div>
                      </div>
                    </div>

                    {e.description && (
                      <div className="mb-4 text-sm text-gray-700 leading-relaxed">
                        {e.description}
                      </div>
                    )}

                    {e.photos?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wide text-blue-700 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Photos
                          </h4>
                          <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
                            {e.photos.length}
                          </span>
                        </div>
                        <AutoRotatingSlideshow photos={e.photos} onImageClick={setOpenImg} />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
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
        {openImg && (
          <img 
            src={openImg.startsWith('http') ? openImg : `${API_URL}${openImg}`} 
            alt="preview" 
            className="w-full rounded" 
          />
        )}
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
