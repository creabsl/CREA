import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

// Utility functions for dismissing ads
const DISMISSED_ADS_KEY = 'crea:dismissedAds'
const DISMISS_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

interface DismissedAdData {
  [adId: string]: number // adId -> timestamp when dismissed
}

function getDismissedAds(): Set<string> {
  try {
    const dismissed = localStorage.getItem(DISMISSED_ADS_KEY)
    if (!dismissed) return new Set()
    
    const data: DismissedAdData = JSON.parse(dismissed)
    const now = Date.now()
    const stillDismissed = new Set<string>()
    const updated: DismissedAdData = {}
    
    // Filter out expired dismissals (older than DISMISS_DURATION)
    for (const [adId, timestamp] of Object.entries(data)) {
      if (now - timestamp < DISMISS_DURATION) {
        stillDismissed.add(adId)
        updated[adId] = timestamp
      }
    }
    
    // Save cleaned up data
    localStorage.setItem(DISMISSED_ADS_KEY, JSON.stringify(updated))
    return stillDismissed
  } catch {
    return new Set()
  }
}

function dismissAd(adId: string) {
  try {
    const dismissed = localStorage.getItem(DISMISSED_ADS_KEY)
    const data: DismissedAdData = dismissed ? JSON.parse(dismissed) : {}
    data[adId] = Date.now()
    localStorage.setItem(DISMISSED_ADS_KEY, JSON.stringify(data))
  } catch {
    // Ignore errors
  }
}

// Advertisement carousel component
function AdCarousel({ ads, position }: { ads: EventAd[], position: 'left' | 'right' }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissedAds, setDismissedAds] = useState<Set<string>>(getDismissedAds())
  
  // Ensure ads is an array
  const adsArray = Array.isArray(ads) ? ads : []
  
  // Filter out dismissed ads (admins always see all ads for management)
  const visibleAds = isAdmin ? adsArray : adsArray.filter(ad => !dismissedAds.has(ad._id))
  
  // Auto-rotate through ads
  useEffect(() => {
    if (visibleAds.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleAds.length)
    }, 5000) // Change ad every 5 seconds
    
    return () => clearInterval(interval)
  }, [visibleAds.length])
  
  const handleDismiss = (adId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dismissAd(adId)
    setDismissedAds(getDismissedAds())
    
    // Reset index if we dismissed the current ad
    if (currentIndex >= visibleAds.length - 1) {
      setCurrentIndex(0)
    }
  }
  
  const hasAds = visibleAds.length > 0
  
  // Show placeholder only to admin, show actual ads to everyone
  if (!hasAds && !isAdmin) return null
  
  return (
    <div className="hidden xl:block flex-shrink-0 w-40">
      {hasAds ? (
        <div className="sticky top-4 w-40 space-y-3">
          <AnimatePresence mode="wait">
            {visibleAds[currentIndex] && (
              <motion.div
                key={visibleAds[currentIndex]._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <a href={visibleAds[currentIndex].link} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={`${API_URL}${visibleAds[currentIndex].imageUrl}`}
                    alt={visibleAds[currentIndex].title}
                    className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  />
                </a>
                {!isAdmin && (
                  <button
                    onClick={(e) => handleDismiss(visibleAds[currentIndex]._id, e)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Dismiss this ad"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {visibleAds.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {visibleAds.map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="sticky top-4 bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 h-96 flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs font-semibold text-gray-400 uppercase">Ad Space</p>
          <p className="text-xs text-gray-400 mt-1">{position === 'left' ? 'Left' : 'Right'} • 160x384</p>
          <span className="mt-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-semibold">Admin Only</span>
        </div>
      )}
    </div>
  )
}

// Legacy components for backward compatibility
function LeftAdSpace({ ad }: { ad: EventAd | null }) {
  return <AdCarousel ads={ad ? [ad] : []} position="left" />
}

function RightAdSpace({ ad }: { ad: EventAd | null }) {
  return <AdCarousel ads={ad ? [ad] : []} position="right" />
}

// Auto-rotating slideshow component for completed events
function AutoRotatingSlideshow({ photos, onImageClick }: { photos: string[], onImageClick: (url: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || photos.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, 3000) // Change image every 3 seconds
    
    return () => clearInterval(interval)
  }, [photos.length, isPaused])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div 
      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex gap-4 items-start">
        {/* Main slideshow container */}
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-md group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={photos[currentIndex]}
              alt={`Event photo ${currentIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              onClick={() => onImageClick(photos[currentIndex])}
            />
          </AnimatePresence>

          {/* Navigation arrows - visible on hover */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                aria-label="Previous photo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-slate-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                aria-label="Next photo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Photo counter badge */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {currentIndex + 1} / {photos.length}
          </div>

          {/* Click to expand hint */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            View
          </div>

          {/* Pause indicator */}
          {isPaused && photos.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Paused
            </div>
          )}
        </div>

        {/* Thumbnail navigation */}
        {photos.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded overflow-hidden border-2 ${
                  idx === currentIndex 
                    ? 'border-gray-900 ring-2 ring-gray-900/20 scale-105' 
                    : 'border-gray-300 hover:border-gray-500 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Go to photo ${idx + 1}`}
              >
                <img 
                  src={photo} 
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-10 h-10 object-cover"
                />
              </button>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

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
        <StaggerContainer className="grid grid-cols-1 gap-8">
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
                  className="group relative rounded-2xl bg-white border-2 border-blue-100 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -4, transition: SPRING.hover }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="h-1.5 bg-gradient-to-r from-[var(--primary)] via-blue-600 to-[var(--primary)]"></div>
                  
                  <div className="p-6 sm:p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-4 leading-tight">
                        {e.title}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 flex-1">
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold text-sm">
                            {new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 flex-1">
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-semibold text-sm">{e.location}</span>
                        </div>
                      </div>
                    </div>

                    {e.description && (
                      <div className="mb-6 p-5 rounded-xl bg-blue-50/40 border border-blue-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-700 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                          Event Details
                        </h4>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">
                          {e.description}
                        </p>
                      </div>
                    )}

                    {e.photos?.length > 0 && (
                      <div className="p-5 rounded-xl bg-blue-50/40 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Event Photos
                          </h4>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                            {e.photos.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {e.photos.map((p, idx) => (
                            <motion.div
                              key={idx}
                              className="relative group/photo aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer bg-gray-100"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setOpenImg(p)}
                            >
                              <img 
                                src={p} 
                                alt={`Event photo ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover/photo:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 transform scale-90 group-hover/photo:scale-100 transition-transform">
                                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
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
