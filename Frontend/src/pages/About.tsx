import { useEffect, useState } from 'react'
import { defaultTimelineStops, defaultPastEvents, type PastEvent } from '../data/aboutDefaults'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader'
import Button from '../components/Button'
import Card from '../components/Card'
import { usePageTitle } from '../hooks/usePageTitle'
import { useAuth } from '../context/auth'
import Modal from '../components/Modal'

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
  // Admin milestone creation moved to Admin Panel

  const isAdmin = user?.role === 'admin'

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
    } catch {}
  }

  useEffect(() => {
    loadMilestonesFromStorage()
    const handler = () => loadMilestonesFromStorage()
    window.addEventListener('crea_milestones_updated' as any, handler)
    return () => window.removeEventListener('crea_milestones_updated' as any, handler)
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
    window.addEventListener('crea_gallery_updated' as any, handler)
    return () => window.removeEventListener('crea_gallery_updated' as any, handler)
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
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">75+</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300">Years of Service</div>
                </div>
                <div className="text-center border-x border-[var(--secondary)]">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">5</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-300">Divisions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">1000+</div>
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

      {/* News Ticker */}
      <div className="relative overflow-hidden">
        <div className="bg-[var(--accent)] text-[var(--text-dark)] px-4 py-2 font-bold text-sm uppercase text-center">
          Upcoming Events
        </div>
        <div className="bg-[#fef9f0] border-b-2 border-[var(--accent)] py-3 overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="whitespace-nowrap text-sm text-gray-700"
          >
            <span className="mx-8">📅 Annual General Meeting - 15 Oct 2024</span>
            <span className="mx-8">🚄 Technical Workshop on High-Speed Rail - 05 Nov 2024</span>
            <span className="mx-8">🎓 Next Webinar on Safety Protocols - 03 Dec 2024</span>
            <span className="mx-8">📅 Annual General Meeting - 15 Oct 2024</span>
            <span className="mx-8">🚄 Technical Workshop on High-Speed Rail - 05 Nov 2024</span>
          </motion.div>
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
      <div className="relative bg-gradient-to-br from-[#0a2343] via-[var(--primary)] to-[#0a2343] rounded-3xl p-8 md:p-12 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(112, 128, 144, 0.5), transparent 50%), radial-gradient(circle at 80% 50%, rgba(242, 169, 0, 0.3), transparent 50%)`
          }} />
        </div>

        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(221, 212, 212, 0.3)' }}>Our Journey Through Time</h2>
            <p className="text-xl text-gray-200">Milestones in CREA's history</p>
          </div>
          
          {/* Enhanced Train Track Timeline */}
          <div className="relative mt-16 mb-12">
            {/* Glowing track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--secondary)] opacity-30 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--secondary)]"></div>
            </div>

            {/* Stations/Stops */}
            <div className="relative flex justify-between items-center px-4">
              {timelineStops.map((stop, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
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
                    
                    {/* Stop circle */}
                    <div
                      className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-2xl transition-all duration-500 ${
                        activeStop === idx
                          ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white ring-4 ring-[var(--accent)]/50 ring-offset-4 ring-offset-[#0a2343]'
                          : 'bg-white text-gray-600 border-4 border-gray-300 hover:border-[var(--secondary)]'
                      }`}
                    >
                      {stop.icon}
                    </div>
                  </motion.button>
                  
                  {/* Year label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`mt-4 font-bold text-lg md:text-xl transition-all duration-300 ${
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
                      className="w-1 h-8 bg-gradient-to-b from-[var(--accent)] to-transparent mt-2"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Animated Train */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none"
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
                className="text-6xl md:text-7xl filter drop-shadow-2xl"
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
              className="relative bg-white rounded-2xl p-8 md:p-10 shadow-2xl"
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/10 to-transparent rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[var(--accent)]/10 to-transparent rounded-br-2xl" />
              
              <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  {/* Year badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg mb-4">
                      <span className="text-2xl">{timelineStops[activeStop].icon}</span>
                      {timelineStops[activeStop].year}
                    </span>
                  </motion.div>
                  
                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]  mb-4"
                  >
                    {timelineStops[activeStop].title}
                  </motion.h3>
                  
                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-lg md:text-xl leading-relaxed"
                  >
                    {timelineStops[activeStop].description}
                  </motion.p>
                </div>
                
                {/* Navigation buttons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex md:flex-col gap-3"
                >
                  <button
                    onClick={prevStop}
                    className="group p-4 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-white hover:from-[#081a32] hover:to-[#5a6a7a] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeftIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={nextStop}
                    className="group p-4 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#d49500] text-white hover:from-[#d49500] hover:to-[#b67f00] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
