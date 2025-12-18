import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Calendar from '../components/Calendar'
import { EventIcon, ForumIcon, CircularIcon, CourtCaseIcon } from '../components/Icons'
import { usePageTitle } from '../hooks/usePageTitle'
import { getCirculars, getCourtCases, getEvents, getForumTopics, getMemberCounts, getTotals, getActiveAdvertisements, getActiveAchievements, getActiveBreakingNews } from '../services/api'
import type { Circular, CourtCase, EventItem, ForumTopic, MemberCount, Advertisement, Achievement, BreakingNews } from '../types'

// Advertisement Carousel Component
function AdvertisementCarousel({ advertisements }: { advertisements: Advertisement[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % advertisements.length)
    }, 5000) // Auto-advance every 5 seconds
    return () => clearInterval(timer)
  }, [advertisements.length, isPaused])

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % advertisements.length)
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length)
  const goToSlide = (index: number) => setCurrentIndex(index)

  const handleVideoPlay = () => setIsPaused(true)
  const handleVideoPause = () => setIsPaused(false)

  const currentAd = advertisements[currentIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <h2 className="text-sm sm:text-base font-semibold text-[var(--primary)]">Latest Announcements</h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 md:p-8">
              {/* Left: Media */}
              <div className="flex items-center justify-center">
                {currentAd.imageUrl ? (
                  <img
                    src={currentAd.imageUrl}
                    alt={currentAd.title}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                ) : currentAd.videoUrl ? (
                  <div className="w-full h-80 rounded-lg shadow-lg overflow-hidden">
                    {currentAd.videoUrl.includes('youtube.com') || currentAd.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${currentAd.videoUrl.split('v=')[1]?.split('&')[0] || currentAd.videoUrl.split('/').pop()}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onMouseEnter={handleVideoPlay}
                        onMouseLeave={handleVideoPause}
                      />
                    ) : (
                      <video 
                        src={currentAd.videoUrl} 
                        controls 
                        className="w-full h-full object-cover"
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onEnded={handleVideoPause}
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg shadow-lg flex items-center justify-center">
                    <svg className="w-32 h-32 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Right: Content */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    currentAd.type === 'announcement' ? 'bg-blue-500 text-white' :
                    currentAd.type === 'achievement' ? 'bg-green-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {currentAd.type.toUpperCase()}
                  </span>
                  {currentAd.priority === 'high' && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                      HIGH PRIORITY
                    </span>
                  )}
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-4">{currentAd.title}</h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">{currentAd.description}</p>

                {currentAd.link && (
                  <a
                    href={currentAd.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#d49500] transition-all shadow-lg hover:shadow-xl w-fit"
                  >
                    <span>Learn More</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {advertisements.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {advertisements.length > 1 && (
        <div className="flex justify-center gap-2 py-4 bg-gray-50">
          {advertisements.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? 'w-8 h-3 bg-[var(--primary)] rounded-full'
                  : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function Dashboard() {
  const [counts, setCounts] = useState<MemberCount[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [cases, setCases] = useState<CourtCase[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([])
  const navigate = useNavigate()
  usePageTitle('CREA • Dashboard')
  const [totals, setTotals] = useState<{ divisions: number; members: number; courtCases: number }>({ divisions: 0, members: 0, courtCases: 0 })
  useEffect(() => {
    const load = async () => {
      const [counts, totals, events, topics, circulars, cases, advertisements, achievements, breakingNews] = await Promise.all([
        getMemberCounts(),
        getTotals(),
        getEvents(),
        getForumTopics(),
        getCirculars(),
        getCourtCases(),
        getActiveAdvertisements().catch(() => []),
        getActiveAchievements().catch(() => []),
        getActiveBreakingNews().catch(() => [])
      ])
      setCounts(counts)
      setTotals(totals)
      setEvents(events)
      setTopics(topics)
      setCirculars(circulars)
      setCases(cases)
      setAdvertisements(advertisements)
      setAchievements(achievements)
      setBreakingNews(breakingNews)
    }
    load()
    const onStats = () => load()
    window.addEventListener('crea:stats-changed', onStats as EventListener)
    return () => window.removeEventListener('crea:stats-changed', onStats as EventListener)
  }, [])

  return (
    <div className="space-y-6">
      {/* Hero Section - Central Railway Portal Style */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#003d82] to-[#0a2343] px-4 sm:px-6 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 text-white">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">Since 1950</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-white/30"></div>
            <div className="flex items-center gap-1 sm:gap-2 text-white/90 text-xs sm:text-sm">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{totals.members}+ Members</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
            {/* Left: Text Content */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premier Association Since 1950
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--primary)] mb-3 leading-tight">
                Central Railway Engineers Association
              </h1>
              
              <p className="text-base sm:text-lg text-[var(--accent)] font-semibold mb-3 sm:mb-4">
                रेलवे अभियंता संघ
              </p>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6">
                Empowering Railway Engineers with professional excellence, advocacy, and community support across Central Railway. We stand united for the welfare, rights, and professional development of all railway engineers.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Legal & Professional Support</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Member Welfare Programs</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Technical Resources</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Community Networking</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/apply-membership')}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[var(--accent)] text-[var(--text-dark)] rounded font-semibold hover:bg-[#d49500] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Apply for Membership
                </button>
                
                <button
                  onClick={() => navigate('/about')}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-[var(--primary)] text-[var(--primary)] rounded font-semibold hover:bg-[var(--primary)] hover:text-white transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About CREA
                </button>
              </div>
            </div>

            {/* Right: Stats Cards */}
            <div className="w-full lg:w-80">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Quick Statistics</h3>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Divisions</div>
                          <div className="text-2xl font-bold text-[var(--primary)]">{totals.divisions}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Total Members</div>
                        <div className="text-2xl font-bold text-[var(--primary)]">{totals.members}+</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Active Cases</div>
                        <div className="text-2xl font-bold text-[var(--primary)]">{totals.courtCases}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="h-2 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)]"></div>
      </div>

      {/* Advertisements Carousel */}
      {advertisements.length > 0 && <AdvertisementCarousel advertisements={advertisements} />}

      {/* Breaking News - Scrolling Ticker */}
      {(breakingNews.length > 0 || events.filter(e => e.breaking).length > 0) && (
        <div className="bg-white border-l-4 border-red-600 shadow-sm overflow-hidden">
          <style>{`
            @keyframes scroll-left {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
            .ticker-scroll {
              display: inline-block;
              white-space: nowrap;
              animation: scroll-left 60s linear infinite;
            }
            .ticker-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex items-center h-9">
            <div className="bg-red-600 text-white px-3 h-full flex items-center flex-shrink-0">
              <span className="font-semibold text-xs uppercase tracking-wide">Breaking News</span>
            </div>
            <div className="flex-1 overflow-hidden relative bg-gray-50">
              <div className="ticker-scroll py-2">
                {breakingNews.map((news, idx) => (
                  <span key={`bn-${idx}`} className="inline-flex items-center mx-6 text-gray-800">
                    <span className="font-medium text-sm">{news.title}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{news.description}</span>
                  </span>
                ))}
                {events.filter(e => e.breaking).map((event, idx) => (
                  <span key={`ev-${idx}`} className="inline-flex items-center mx-6 text-gray-800">
                    <span className="font-medium text-sm">{event.title}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content grid */}
      {/* Division-wise Member Count - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
          <h2 className="text-base font-semibold text-[var(--primary)]">Division-wise Member Count</h2>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {counts.map((c, index) => (
              <div
                key={c.division || `division-${index}`}
                className="bg-gray-50 rounded border border-gray-200 p-3 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {c.division || 'N/A'}
                </div>
                <div className="text-2xl font-bold text-[var(--primary)]">{c.count}</div>
                <div className="text-xs text-gray-500 mt-0.5">Members</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Achievements Section */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="px-5 py-3 bg-orange-50 border-b border-orange-100">
            <h2 className="text-base font-semibold text-orange-900">Recent Achievements</h2>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {achievements.slice(0, 12).map((achievement) => (
                <div
                  key={achievement._id}
                  className="bg-gray-50 rounded border border-gray-200 overflow-hidden hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  {/* Image - Compact */}
                  {achievement.imageUrl && (
                    <div className="relative h-24 overflow-hidden bg-gray-100">
                      <img 
                        src={achievement.imageUrl} 
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium text-white ${
                          achievement.type === 'award' ? 'bg-yellow-600' :
                          achievement.type === 'courtCase' ? 'bg-green-600' :
                          'bg-blue-600'
                        }`}>
                          <span className="text-[10px] uppercase tracking-wide">
                            {achievement.type === 'courtCase' ? 'Legal' : achievement.type}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="text-xs text-gray-500">
                        {new Date(achievement.date).toLocaleDateString('en-US', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                      {achievement.category && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500 truncate">{achievement.category}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Member Benefits Showcase & Why Join CREA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-white rounded-lg shadow border border-gray-200"
        >
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <h2 className="text-base font-semibold text-[var(--primary)]">Member Benefits</h2>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: '⚖️', title: 'Legal Support', desc: 'Expert legal assistance' },
                { icon: '🏥', title: 'Welfare Programs', desc: 'Medical & financial aid' },
                { icon: '📚', title: 'Resources', desc: 'Manuals & guidelines' },
                { icon: '🤝', title: 'Networking', desc: 'Connect nationwide' },
                { icon: '🎓', title: 'Training', desc: 'Development workshops' },
                { icon: '📢', title: 'Advocacy', desc: 'Strong representation' }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[var(--accent)] hover:shadow transition-all"
                >
                  <div className="text-2xl mb-1">{benefit.icon}</div>
                  <h3 className="font-semibold text-sm text-[var(--primary)] mb-0.5">{benefit.title}</h3>
                  <p className="text-xs text-gray-600">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why Join CREA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-white rounded-lg shadow border border-gray-200"
        >
          <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h2 className="text-base font-semibold text-[var(--accent)]">Why Join CREA?</h2>
            </div>
          </div>
          
          <div className="p-4 space-y-2">
            {[
              { 
                title: 'Since 1950', 
                desc: '75+ years serving engineers',
                icon: (
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                title: `${totals.members}+ Members`, 
                desc: 'Largest railway association',
                icon: (
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              { 
                title: 'All Divisions', 
                desc: 'Mumbai, Bhusawal, Pune, Solapur, Nagpur',
                icon: (
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              { 
                title: 'Proven Track Record', 
                desc: 'Multiple legal victories & achievements',
                icon: (
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                title: 'Strong Advocacy', 
                desc: 'Powerful voice in administration',
                icon: (
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                )
              },
              { 
                title: 'Community Support', 
                desc: 'Supportive professional family',
                icon: (
                  <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )
              }
            ].map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.05 }}
                whileHover={{ x: 2 }}
                className="flex gap-3 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">{reason.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--primary)]">{reason.title}</h3>
                  <p className="text-xs text-gray-600">{reason.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* What's New & Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* What's New - 2 columns */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
              <h2 className="text-base font-semibold text-[var(--primary)]">What's New</h2>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                {/* Events */}
                <div className="border-l-3 border-blue-500 pl-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <EventIcon />
                      <h3 className="text-sm font-semibold text-gray-700">Events</h3>
                    </div>
                    <button 
                      onClick={()=>navigate('/events')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {events.slice(0, 3).map(e => (
                      <div key={e.id} className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer line-clamp-1">
                        • {e.title} - {e.location}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forum */}
                <div className="border-l-3 border-green-500 pl-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ForumIcon />
                      <h3 className="text-sm font-semibold text-gray-700">Forum</h3>
                    </div>
                    <button 
                      onClick={()=>navigate('/forum')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {topics.slice(0, 3).map(t => (
                      <div key={t.id} className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer line-clamp-1">
                        • {t.title} ({t.replies} replies)
                      </div>
                    ))}
                  </div>
                </div>

                {/* Circulars */}
                <div className="border-l-3 border-orange-500 pl-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CircularIcon />
                      <h3 className="text-sm font-semibold text-gray-700">Circulars</h3>
                    </div>
                    <button 
                      onClick={()=>navigate('/documents?tab=circular')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {circulars.slice(0, 3).map(c => (
                      <div key={c.id} className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer line-clamp-1">
                        • {c.subject} ({c.boardNumber})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Court Cases */}
                <div className="border-l-3 border-red-500 pl-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CourtCaseIcon />
                      <h3 className="text-sm font-semibold text-gray-700">Court Cases</h3>
                    </div>
                    <button 
                      onClick={()=>navigate('/documents?tab=court-case')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {cases.slice(0, 3).map(cc => (
                      <div key={cc.id} className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer line-clamp-1">
                        • {cc.caseNumber} - {cc.subject}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Calendar - 1 column */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            <Calendar 
              year={new Date().getFullYear()} 
              month={new Date().getMonth()} 
              markers={events.map(e => ({
                date: e.date,
                title: e.title,
                type: e.breaking ? 'breaking' : 'event'
              }))}
            />
          </motion.div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="bg-white rounded-lg overflow-hidden shadow border border-gray-200"
      >
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-base font-semibold text-gray-700">Quick Actions</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                <button
                  onClick={() => navigate('/apply-membership')}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-3 hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg flex flex-col items-center justify-center gap-1.5 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-center leading-tight">Apply<br/>Membership</span>
                </button>
                
                <button
                  onClick={() => navigate('/documents?tab=manual')}
                  className="bg-white border-2 border-gray-200 text-gray-700 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-lg flex flex-col items-center justify-center gap-1.5 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-[10px] font-semibold text-center">Manuals</span>
                </button>
                
                <button
                  onClick={() => navigate('/mutual-transfers')}
                  className="bg-white border-2 border-gray-200 text-gray-700 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-lg flex flex-col items-center justify-center gap-1.5 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-[10px] font-semibold text-center">Transfers</span>
                </button>
                
                <button
                  onClick={() => navigate('/external-links')}
                  className="bg-white border-2 border-gray-200 text-gray-700 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-lg flex flex-col items-center justify-center gap-1.5 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-[10px] font-semibold text-center">Links</span>
                </button>
                
                <button
                  onClick={() => navigate('/events')}
                  className="bg-white border-2 border-gray-200 text-gray-700 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-lg flex flex-col items-center justify-center gap-1.5 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-center">Events</span>
                </button>
                
                <button
                  onClick={() => navigate('/forum')}
                  className="bg-white border-2 border-gray-200 text-gray-700 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-all hover:shadow-lg flex flex-col items-center justify-center gap-1.5 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <span className="text-[10px] font-semibold text-center">Forum</span>
                </button>
              </div>
            </div>
          </motion.div>
    </div>
  )
}
