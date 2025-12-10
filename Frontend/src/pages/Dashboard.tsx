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
import { getCirculars, getCourtCases, getEvents, getForumTopics, getMemberCounts, getTotals } from '../services/api'
import type { Circular, CourtCase, EventItem, ForumTopic, MemberCount } from '../types'

export default function Dashboard() {
  const [counts, setCounts] = useState<MemberCount[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [cases, setCases] = useState<CourtCase[]>([])
  const navigate = useNavigate()
  usePageTitle('CREA • Dashboard')
  const [totals, setTotals] = useState<{ divisions: number; members: number; courtCases: number }>({ divisions: 0, members: 0, courtCases: 0 })
  useEffect(() => {
    const load = async () => {
      const [counts, totals, events, topics, circulars, cases] = await Promise.all([
        getMemberCounts(),
        getTotals(),
        getEvents(),
        getForumTopics(),
        getCirculars(),
        getCourtCases(),
      ])
      setCounts(counts)
      setTotals(totals)
      setEvents(events)
      setTopics(topics)
      setCirculars(circulars)
      setCases(cases)
    }
    load()
    const onStats = () => load()
    window.addEventListener('crea:stats-changed', onStats as EventListener)
    return () => window.removeEventListener('crea:stats-changed', onStats as EventListener)
  }, [])

  const breaking = useMemo(() => events.find(e => e.breaking), [events])

  return (
    <div className="space-y-6">
      {/* Compact Hero Section with Stats */}
      <motion.div
        className="relative rounded-xl bg-gradient-to-br from-[#0d2c54] via-[#19417d] to-[#0a2343] text-white p-6 overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated decorative background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <motion.div 
            className="absolute -top-1/2 -right-1/4 w-[400px] h-[400px] bg-[var(--accent)] rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Top Row: Badge and Description */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block mb-3"
              >
                <span className="bg-[var(--accent)]/20 text-[var(--accent)] px-3 py-1 rounded-full text-xs font-bold border border-[var(--accent)]/30 backdrop-blur-sm uppercase tracking-wider">
                  ✦ Since 1950
                </span>
              </motion.div>
              
              <p className="text-white/90 text-sm leading-relaxed max-w-2xl">
                Empowering Railway Engineers across Central Railway with professional excellence, 
                advocacy, and community support. Connecting <span className="text-[var(--accent)] font-bold">{totals.members}+ engineers</span> across <span className="text-[var(--accent)] font-bold">{totals.divisions} divisions</span>.
              </p>
            </div>

            {/* Compact Stats in Row */}
            <div className="flex gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20 min-w-[100px]"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totals.divisions}</div>
                  <div className="text-xs text-gray-300">Divisions</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20 min-w-[100px]"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totals.members}+</div>
                  <div className="text-xs text-gray-300">Members</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-3 border border-white/20 min-w-[100px]"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totals.courtCases}</div>
                  <div className="text-xs text-gray-300">Active Cases</div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Row: Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/apply-membership')}
              className="px-5 py-2.5 bg-[var(--accent)] text-[var(--text-dark)] rounded-lg font-semibold hover:bg-[#d49500] transition-all duration-300 shadow-lg text-sm"
            >
              Apply for Membership
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/about')}
              className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/30 text-sm"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </motion.div>

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
          
          {/* Division-wise Member Count with enhanced design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-dark)]">Division-wise Member Count</h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-[var(--accent)] to-transparent ml-4 rounded-full"></div>
            </div>
            
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {counts.map((c, index) => (
                <StaggerItem key={c.division}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card delay={index * STAGGER.children}>
                      <div className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--accent)]/5 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative">
                          <div className="text-xs font-semibold text-[var(--secondary)] uppercase tracking-wide mb-2">{c.division}</div>
                          <div className="text-3xl font-bold text-[var(--primary)]">{c.count}</div>
                          <div className="text-xs text-gray-500 mt-1">Engineers</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>

          {/* What's New Section with enhanced cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-dark)]">What's New</h2>
                <p className="text-sm text-gray-600">Recent updates from across the portal</p>
              </div>
              <div className="h-1 flex-1 bg-gradient-to-r from-[var(--accent)] to-transparent ml-4 rounded-full"></div>
            </div>
            
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
                onViewAll={()=>navigate('/circulars')} 
                delay={2} 
              />
              <QuickPreviewCard 
                title="Court Cases" 
                icon={<CourtCaseIcon />} 
                items={cases.map(cc => ({ id: cc.id, title: cc.caseNumber, subtitle: cc.subject, date: cc.date }))} 
                onViewAll={()=>navigate('/court-cases')} 
                delay={3} 
              />
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
