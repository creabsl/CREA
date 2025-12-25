import { useEffect, useState, useRef } from 'react'
import { defaultTimelineStops, defaultPastEvents, type PastEvent } from '../data/aboutDefaults'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import Card from '../components/Card'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'
import Modal from '../components/Modal'
import { getTotals } from '../services/api'

// Simple Chevron Icons
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

// Timeline data for the interactive train journey (initial values)
type TimelineStop = { year: string; title: string; description: string; icon: string }

const aims = [
  {
    icon: '🎯',
    title: 'Career Development',
    text: 'To improve moral, social & economical conditions & career prospects of its member and to protect & safeguard their rights and privileges.'
  },
  {
    icon: '🤝',
    title: 'Unity & Brotherhood',
    text: 'To Promote friendly feelings, brotherhood, solidarity & co-operation among its members.'
  },
  {
    icon: '🚄',
    title: 'Technical Excellence',
    text: 'To make optimum utilisation of resources by implementing advance technologies for the safe, efficient and profitable running of Railways.'
  }
]

const eligibilityCriteria = [
  'All gazetted and non-gazetted Railway Engineers working in Central Railway',
  'Engineers in supervisory and technical positions across all divisions',
  'Retired engineers (Associate membership available)',
  'Engineering students pursuing railway-related courses (Student membership)'
]

const faqs = [
  {
    question: 'How do I apply for membership?',
    answer: 'You can apply online through our Membership Application portal. Fill out the form, upload required documents, and submit. Our team will review and approve within 7 working days.'
  },
  {
    question: 'What are the membership fees?',
    answer: 'Annual membership is ₹500 for regular members. Lifetime membership is available at ₹5,000. Student membership is ₹200 per year.'
  },
  {
    question: 'What benefits do members receive?',
    answer: 'Members get access to technical resources, professional development programs, legal support, welfare schemes, networking opportunities, and representation in policy discussions.'
  },
  {
    question: 'Can retired engineers join CREA?',
    answer: 'Yes! Retired engineers are eligible for Associate Membership and can continue to participate in most CREA activities and benefit from networking opportunities.'
  }
]

const pastEvents = defaultPastEvents

// Counter Animation Component
function CountUp({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <div ref={ref} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">
      {count}{suffix}
    </div>
  )
}

export default function About() {
  usePageTitle('CREA • About Us')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [timelineStops, setTimelineStops] = useState<TimelineStop[]>(defaultTimelineStops)
  const [activeStop, setActiveStop] = useState(0)
  const [trainFacingRight, setTrainFacingRight] = useState(true) // Track train direction
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [charterPdfUrl, setCharterPdfUrl] = useState('/charter-of-demand-demo.pdf')
  const [memberCount, setMemberCount] = useState(0)
  const [divisions, setDivisions] = useState(5)
  // Admin milestone creation moved to Admin Panel

  const isAdmin = user?.role === 'admin'

  // Fetch actual member count from API
  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const data = await getTotals()
        setMemberCount(data.members)
        setDivisions(data.divisions)
      } catch (error) {
        console.error('Failed to fetch totals:', error)
        // Use default fallback values
        setMemberCount(1000)
        setDivisions(5)
      }
    }
    fetchTotals()
  }, [])

  const handlePdfDownload = () => {
    // Create a demo PDF download
    const link = document.createElement('a')
    link.href = charterPdfUrl
    link.download = 'CREA-Charter-of-Demand.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePdfView = () => {
    // Open PDF in new browser tab for viewing
    window.open(charterPdfUrl, '_blank')
  }

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file)
      setCharterPdfUrl(url)
      setShowUploadModal(false)
      alert('Charter PDF updated successfully!')
    } else {
      alert('Please select a valid PDF file')
    }
  }

  const nextStop = () => {
    setTrainFacingRight(true) // Always face right when going forward
    setActiveStop((prev) => (prev + 1) % timelineStops.length)
  }

  const prevStop = () => {
    setTrainFacingRight(false) // Always face left when going backward
    setActiveStop((prev) => (prev - 1 + timelineStops.length) % timelineStops.length)
  }

  const goToStop = (idx: number) => {
    // Always face right when moving forward, left when moving backward
    if (idx > activeStop) {
      setTrainFacingRight(true) // Moving forward (right)
    } else if (idx < activeStop) {
      setTrainFacingRight(false) // Moving backward (left)
    }
    // If clicking same stop, maintain current direction
    setActiveStop(idx)
  }

  // handleAddMilestone removed (handled in Admin Panel)

  // Load any admin-added milestones and removed-defaults from localStorage and merge
  const loadMilestonesFromStorage = () => {
    try {
      const raw = localStorage.getItem('crea_timeline_milestones')
      const extra: TimelineStop[] = raw ? JSON.parse(raw) : []
      const removedRaw = localStorage.getItem('crea_timeline_removed_defaults')
      const removed: string[] = removedRaw ? JSON.parse(removedRaw) : []
      const removedSet = new Set(removed)
      const defaultsFiltered = defaultTimelineStops.filter(m => !removedSet.has(`${m.year}|${m.title}`))
      const merged = [...defaultsFiltered, ...(Array.isArray(extra) ? extra : [])].sort(
        (a, b) => parseInt(a.year) - parseInt(b.year)
      )
      setTimelineStops(merged)
    } catch (error) {
      console.error('Failed to load milestones:', error)
    }
  }

  useEffect(() => {
    loadMilestonesFromStorage()
    const handler = () => loadMilestonesFromStorage()
    window.addEventListener('crea_milestones_updated', handler)
    return () => window.removeEventListener('crea_milestones_updated', handler)
  }, [])

  // Gallery state that reacts to Admin updates
  const [gallery, setGallery] = useState<PastEvent[]>(pastEvents)

  const loadGalleryFromStorage = () => {
    try {
      const rawGal = localStorage.getItem('crea_past_events')
      const extra: PastEvent[] = rawGal ? JSON.parse(rawGal) : []
      const removedRaw = localStorage.getItem('crea_past_events_removed_defaults')
      const removed: number[] = removedRaw ? JSON.parse(removedRaw) : []
      const removedSet = new Set(removed)
      const defaultsFiltered = defaultPastEvents.filter(e => !removedSet.has(e.id))
      const baseIds = new Set(defaultsFiltered.map(e => e.id))
      const merged = [...defaultsFiltered, ...(Array.isArray(extra) ? extra.filter(e => !baseIds.has(e.id)) : [])]
      setGallery(merged)
    } catch {
      setGallery(pastEvents)
    }
  }

  useEffect(() => {
    loadGalleryFromStorage()
    const handler = () => loadGalleryFromStorage()
    // Listen for Admin side updates
    window.addEventListener('crea_gallery_updated', handler)
    return () => window.removeEventListener('crea_gallery_updated', handler)
  }, [])

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0a2343] via-[var(--primary)] to-[#051121] text-white overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[var(--secondary)] rounded-full opacity-10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[var(--primary)] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Diagonal pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-16 md:py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-6"
              >
                <span className="bg-[var(--primary)]/20 text-gray-100 px-6 py-2 rounded-full text-sm font-semibold border border-[var(--secondary)]/30 backdrop-blur-sm">
                  Est. 1950
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
                style={{ color: 'white' }}
              >
                About CREA
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-4 font-light"
              >
                Central Railway Engineers Association
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4"
              >
                Empowering Railway Engineers with professional excellence, 
                advocacy, and community support for over seven decades
              </motion.p>

              {/* Stats bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto"
              >
                <div className="text-center">
                  <CountUp end={75} duration={2.5} suffix="+" />
                  <div className="text-xs sm:text-sm md:text-base text-gray-300">Years of Service</div>
                </div>
                <div className="text-center border-x border-[var(--secondary)]">
                  <CountUp end={divisions} duration={1.5} suffix="" />
                  <div className="text-xs sm:text-sm md:text-base text-gray-300">Divisions</div>
                </div>
                <div className="text-center">
                  <CountUp end={memberCount} duration={2.5} suffix="+" />
                  <div className="text-xs sm:text-sm md:text-base text-gray-300">Members</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 sm:h-16 md:h-20">
            <path d="M0,0 C300,60 900,60 1200,0 L1200,120 L0,120 Z" fill="white" fillOpacity="1" />
          </svg>
        </div>
      </div>

      {/* Aim & Objectives */}
      <div>
        <SectionHeader title="Our Aim & Objectives" subtitle="Guiding principles that drive our mission" />
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {aims.map((aim, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <div className="text-5xl mb-4">{aim.icon}</div>
                <h3 className="text-xl font-bold text-[var(--primary)] mb-3">{aim.title}</h3>
                <p className="text-gray-600 leading-relaxed">{aim.text}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="relative bg-gradient-to-br from-[#0a2343] via-[var(--primary)] to-[#0a2343] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(112, 128, 144, 0.5), transparent 50%), radial-gradient(circle at 80% 50%, rgba(242, 169, 0, 0.3), transparent 50%)`
          }} />
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 px-2" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(221, 212, 212, 0.3)' }}>Our Journey Through Time</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 px-2">Milestones in CREA's history</p>
          </div>
          
          {/* Enhanced Train Track Timeline */}
          <div className="relative mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0">
            {/* Glowing track */}
            <div className="absolute top-1/2 left-2 right-2 sm:left-0 sm:right-0 h-0.5 sm:h-1 -translate-y-1/2">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--secondary)] opacity-30 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--secondary)]"></div>
            </div>

            {/* Stations/Stops */}
            <div className="relative flex justify-center sm:justify-between items-center gap-1 sm:gap-2 md:gap-4 px-0 sm:px-2 md:px-4">
              {timelineStops.map((stop, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 min-w-0">
                  <motion.button
                    onClick={() => goToStop(idx)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative z-20 transition-all duration-500 ${
                      activeStop === idx ? 'scale-110' : 'scale-100'
                    }`}
                  >
                    {/* Glow effect for active stop */}
                    {activeStop === idx && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-[var(--accent)] rounded-full blur-xl opacity-50"
                      />
                    )}
                    
                    {/* Stop circle - Responsive sizes */}
                    <div
                      className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-lg sm:text-2xl md:text-3xl lg:text-4xl shadow-2xl transition-all duration-500 ${
                        activeStop === idx
                          ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white ring-2 sm:ring-3 md:ring-4 ring-[var(--accent)]/50 ring-offset-2 sm:ring-offset-3 md:ring-offset-4 ring-offset-[#0a2343]'
                          : 'bg-white text-gray-600 border-2 sm:border-3 md:border-4 border-gray-300 hover:border-[var(--secondary)]'
                      }`}
                    >
                      {stop.icon}
                    </div>
                  </motion.button>
                  
                  {/* Year label - Responsive text */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`mt-2 sm:mt-3 md:mt-4 font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl transition-all duration-300 whitespace-nowrap ${
                      activeStop === idx 
                        ? 'text-[var(--accent)] scale-110' 
                        : 'text-gray-200'
                    }`}
                  >
                    {stop.year}
                  </motion.div>
                  
                  {/* Connection line indicator */}
                  {activeStop === idx && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      className="w-0.5 sm:w-1 h-4 sm:h-6 md:h-8 bg-gradient-to-b from-[var(--accent)] to-transparent mt-1 sm:mt-2"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Animated Train - Hidden on mobile, visible on tablet+ */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden sm:block"
              animate={{
                left: `${(activeStop / (timelineStops.length - 1)) * 100}%`,
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  scaleX: trainFacingRight ? -1 : 1  // -1 = facing right (flipped), 1 = facing left (normal)
                }}
                transition={{ 
                  y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                  scaleX: { duration: 0.3, ease: 'easeOut' }
                }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl filter drop-shadow-2xl"
              >
                🚂
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Timeline Content Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStop}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl"
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-[var(--primary)]/10 to-transparent rounded-tl-xl sm:rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-tl from-[var(--accent)]/10 to-transparent rounded-br-xl sm:rounded-br-2xl" />
              
              <div className="relative flex flex-col gap-4 sm:gap-5 md:gap-6">
                <div className="flex-1">
                  {/* Year badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-full text-sm sm:text-base md:text-lg font-bold shadow-lg mb-3 sm:mb-4">
                      <span className="text-lg sm:text-xl md:text-2xl">{timelineStops[activeStop].icon}</span>
                      {timelineStops[activeStop].year}
                    </span>
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] mb-3 sm:mb-4 leading-tight"
                  >
                    {timelineStops[activeStop].title}
                  </motion.h3>
                  
                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed"
                  >
                    {timelineStops[activeStop].description}
                  </motion.p>
                </div>
                
                {/* Navigation buttons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center sm:justify-end gap-3 mt-2"
                >
                  <button
                    onClick={prevStop}
                    disabled={activeStop === 0}
                    className={`group p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 ${
                      activeStop === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white hover:from-[#081a32] hover:to-[#5a6a7a] hover:shadow-xl hover:scale-110 active:scale-95'
                    }`}
                    aria-label="Previous milestone"
                  >
                    <ChevronLeftIcon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${activeStop !== 0 && 'group-hover:-translate-x-1'}`} />
                  </button>
                  <button
                    onClick={nextStop}
                    disabled={activeStop === timelineStops.length - 1}
                    className={`group p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 ${
                      activeStop === timelineStops.length - 1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-br from-[var(--accent)] to-[#d49500] text-white hover:from-[#d49500] hover:to-[#b67f00] hover:shadow-xl hover:scale-110 active:scale-95'
                    }`}
                    aria-label="Next milestone"
                  >
                    <ChevronRightIcon className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${activeStop !== timelineStops.length - 1 && 'group-hover:translate-x-1'}`} />
                  </button>
                </motion.div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-8 flex items-center gap-2">
                {timelineStops.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToStop(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStop === idx 
                        ? 'w-12 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]' 
                        : 'w-2 bg-gray-300 hover:bg-[var(--secondary)]'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add Milestone moved to Admin Panel */}

      {/* Charter of Demand */}
      <div>
        <SectionHeader title="Charter of Demand" subtitle="Our key demands and advocacy points" />
        <Card className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[var(--primary)] mb-2">Official Charter of Demand Document</h3>
              <p className="text-gray-600">
                Review our comprehensive charter outlining the demands and requirements for the welfare of railway engineers.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handlePdfDownload}
                className="bg-red-600 hover:bg-red-700"
              >
                📄 Download PDF
              </Button>
              <Button 
                variant="secondary"
                onClick={handlePdfView}
              >
                🌐 View Web Version
              </Button>
              {isAdmin && (
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  ⬆️ Upload New PDF
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Upload Modal (Admin Only) */}
      {showUploadModal && (
        <Modal open={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Charter of Demand PDF">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Select a PDF file to update the Charter of Demand document. Only PDF files are accepted.
            </p>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Choose PDF File
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Membership Eligibility */}
      <div>
        <SectionHeader title="Membership Eligibility" subtitle="Who can join CREA" />
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <h3 className="text-xl font-bold text-[var(--primary)] mb-4">Eligibility Criteria</h3>
            <ul className="space-y-3">
              {eligibilityCriteria.map((criteria, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span className="text-gray-700">{criteria}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button 
                className="w-full"
                onClick={() => navigate('/membership')}
              >
                Apply for Membership
              </Button>
            </div>
          </Card>

          {/* FAQs */}
          <Card>
            <h3 className="text-xl font-bold text-[var(--primary)] mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-200 last:border-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full text-left py-3 flex items-center justify-between hover:text-[var(--primary)] transition"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <span className="text-xl">{expandedFaq === idx ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-3 text-gray-600">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Past Events Gallery */}
      <div>
        <SectionHeader title="Past Events Gallery" subtitle="Moments captured from our events and activities" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {gallery.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.05 }}
              className="relative rounded-lg overflow-hidden cursor-pointer shadow-lg group"
            >
              <img
                src={event.thumbnail}
                alt={event.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div className="text-white">
                  <div className="text-xs uppercase font-semibold mb-1">
                    {event.type === 'video' ? '▶️ Video' : '📷 Photo'}
                  </div>
                  <div className="font-semibold">{event.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
