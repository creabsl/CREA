import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { STAGGER } from '../animations'
import Card from '../components/Card'
import Calendar from '../components/Calendar'
import BreakingNews from '../components/BreakingNews'
import QuickPreviewCard from '../components/QuickPreviewCard'
import { EventIcon, ForumIcon, CircularIcon, CourtCaseIcon } from '../components/Icons'
import { StaggerContainer, StaggerItem } from '../components/StaggerAnimation'
import { usePageTitle } from '../hooks/usePageTitle'
import { getCirculars, getCourtCases, getEvents, getForumTopics, getMemberCounts, getTotals, getActivePromotions } from '../services/api'
import type { Circular, CourtCase, EventItem, ForumTopic, MemberCount, Promotion } from '../types'

export default function Dashboard() {
  const [counts, setCounts] = useState<MemberCount[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [cases, setCases] = useState<CourtCase[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const navigate = useNavigate()
  usePageTitle('CREA • Dashboard')
  const [totals, setTotals] = useState<{ divisions: number; members: number; courtCases: number }>({ divisions: 0, members: 0, courtCases: 0 })
  useEffect(() => {
    const load = async () => {
      const [counts, totals, events, topics, circulars, cases, promotions] = await Promise.all([
        getMemberCounts(),
        getTotals(),
        getEvents(),
        getForumTopics(),
        getCirculars(),
        getCourtCases(),
        getActivePromotions().catch(() => []),
      ])
      setCounts(counts)
      setTotals(totals)
      setEvents(events)
      setTopics(topics)
      setCirculars(circulars)
      setCases(cases)
      setPromotions(promotions)
    }
    load()
    const onStats = () => load()
    window.addEventListener('crea:stats-changed', onStats as EventListener)
    return () => window.removeEventListener('crea:stats-changed', onStats as EventListener)
  }, [])

  const breaking = useMemo(() => events.find(e => e.breaking), [events])

  return (
    <div className="space-y-6">
      {/* Professional Hero Banner - Railway Style */}
      <motion.div
        className="relative rounded-lg bg-gradient-to-r from-[#003d82] via-[#0a2343] to-[#19417d] text-white overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Indian Railway Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative z-10 px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="bg-[var(--accent)] text-[var(--text-dark)] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  Established 1950
                </div>
                <div className="hidden sm:block text-white/70 text-sm">
                  | Serving Railway Engineers for 75+ Years
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight"
                style={{ color: 'white' }}
              >
                Central Railway Engineers Association
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-sm lg:text-base max-w-2xl leading-relaxed"
              >
                रेलवे अभियंता संघ • Empowering Railway Engineers with professional excellence, advocacy, and community support across Central Railway.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 mt-6"
              >
                <button
                  onClick={() => navigate('/apply-membership')}
                  className="px-6 py-3 bg-[var(--accent)] text-[var(--text-dark)] rounded-md font-semibold hover:bg-[#d49500] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Apply for Membership
                </button>
                
                <button
                  onClick={() => navigate('/about')}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-md font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learn More
                </button>
              </motion.div>
            </div>

            {/* Right Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                <div className="text-3xl font-bold text-[var(--accent)] mb-1">{totals.divisions}</div>
                <div className="text-xs text-white/80 uppercase tracking-wide">Divisions</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                <div className="text-3xl font-bold text-[var(--accent)] mb-1">{totals.members}+</div>
                <div className="text-xs text-white/80 uppercase tracking-wide">Members</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20 text-center hover:bg-white/15 transition-all">
                <div className="text-3xl font-bold text-[var(--accent)] mb-1">{totals.courtCases}</div>
                <div className="text-xs text-white/80 uppercase tracking-wide">Active Cases</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Accent Border */}
        <div className="h-1 bg-gradient-to-r from-[var(--accent)] via-yellow-400 to-[var(--accent)]"></div>
      </motion.div>

      {/* Promotions Section - Only show if there are active promotions */}
      {promotions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg shadow-md border-l-4 border-orange-500 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-orange-900">Latest Updates & Announcements</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map((promo, index) => (
                <motion.div
                  key={promo._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    promo.priority === 'high' ? 'border-l-4 border-red-500' : 
                    promo.priority === 'medium' ? 'border-l-4 border-yellow-500' : 
                    'border-l-4 border-blue-500'
                  }`}
                  onClick={() => promo.link && window.open(promo.link, '_blank')}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      promo.type === 'promotion' ? 'bg-purple-100' :
                      promo.type === 'achievement' ? 'bg-green-100' :
                      promo.type === 'announcement' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {promo.type === 'promotion' && (
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )}
                      {promo.type === 'achievement' && (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      )}
                      {promo.type === 'announcement' && (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                      )}
                      {promo.type === 'notification' && (
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{promo.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{promo.description}</p>
                      {promo.link && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium">
                          <span>Read more</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Breaking News Alert */}
      {breaking && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <BreakingNews
            title={breaking.title}
            content={`Scheduled event at ${breaking.location}`}
            date={breaking.date}
            location={breaking.location}
          />
        </motion.div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: Quick previews and links */}
        <div className="space-y-6 xl:col-span-2">
          
          {/* Division-wise Member Count - Government Portal Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Professional Header with Icon */}
            <div className="bg-gradient-to-r from-[var(--primary)] to-[#1a4d8f] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold !text-white drop-shadow-md">Division-wise Member Count</h2>
              </div>
            </div>
            
            {/* Content with Enhanced Cards */}
            <div className="p-6 bg-gray-50">
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {counts.map((c, index) => (
                  <StaggerItem key={c.division}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{c.division}</div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-[var(--primary)] mb-1">{c.count}</div>
                        <div className="text-xs text-gray-600 font-medium">Engineers</div>
                      </div>
                      <div className="h-1 bg-gradient-to-r from-[var(--accent)] to-transparent"></div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </motion.div>

          {/* What's New Section - Professional Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--primary)] to-[#1a4d8f] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold !text-white drop-shadow-md">What's New</h2>
                  <p className="text-white/80 text-xs">Latest updates from across the portal</p>
                </div>
              </div>
            </div>
            
            {/* Content Grid */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickPreviewCard 
                  title="Events" 
                  icon={<EventIcon />} 
                  items={events.map(e => ({ id: e.id, title: e.title, subtitle: e.location, date: e.date }))} 
                  onViewAll={()=>navigate('/events')} 
                  delay={0} 
                />
                <QuickPreviewCard 
                  title="Forum" 
                  icon={<ForumIcon />} 
                  items={topics.map(t => ({ id: t.id, title: t.title, subtitle: `${t.replies} replies`, date: t.createdAt }))} 
                  onViewAll={()=>navigate('/forum')} 
                  delay={1} 
                />
                <QuickPreviewCard 
                  title="Circulars" 
                  icon={<CircularIcon />} 
                  items={circulars.map(c => ({ id: c.id, title: c.subject, subtitle: c.boardNumber, date: c.dateOfIssue }))} 
                  onViewAll={()=>navigate('/documents?tab=circular')} 
                  delay={2} 
                />
                <QuickPreviewCard 
                  title="Court Cases" 
                  icon={<CourtCaseIcon />} 
                  items={cases.map(cc => ({ id: cc.id, title: cc.caseNumber, subtitle: cc.subject, date: cc.date }))} 
                  onViewAll={()=>navigate('/documents?tab=court-case')} 
                  delay={3} 
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column: Calendar and quick actions */}
        <div className="space-y-6">
          {/* Professional Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
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
          </motion.div>

          {/* Quick Links with enhanced design */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
              {/* Professional Header */}
              <div className="bg-gradient-to-r from-[var(--primary)] to-[#1a4d8f] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg !text-white drop-shadow-md">Quick Actions</h3>
                </div>
              </div>
              
              {/* Buttons Section with lighter background */}
              <div className="p-5 space-y-3 bg-gray-50">
                <button
                  onClick={() => navigate('/apply-membership')}
                  className="w-full bg-[var(--accent)] text-[var(--text-dark)] rounded-lg px-4 py-3 font-semibold hover:bg-[#d49500] transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex items-center justify-between group"
                >
                  <span>Apply for Membership</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <button
                  onClick={() => navigate('/manuals')}
                  className="w-full bg-white border border-gray-200 text-[var(--primary)] rounded-lg px-4 py-3 font-semibold hover:bg-gray-100 hover:border-[var(--primary)] transition-all duration-300 hover:shadow-md flex items-center justify-between group"
                >
                  <span>View Manuals</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                
                <button
                  onClick={() => navigate('/mutual-transfers')}
                  className="w-full bg-white border border-gray-200 text-[var(--primary)] rounded-lg px-4 py-3 font-semibold hover:bg-gray-100 hover:border-[var(--primary)] transition-all duration-300 hover:shadow-md flex items-center justify-between group"
                >
                  <span>Mutual Transfers</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate('/external-links')}
                  className="w-full bg-white border border-gray-200 text-[var(--primary)] rounded-lg px-4 py-3 font-semibold hover:bg-gray-100 hover:border-[var(--primary)] transition-all duration-300 hover:shadow-md flex items-center justify-between group"
                >
                  <span>External Links</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
