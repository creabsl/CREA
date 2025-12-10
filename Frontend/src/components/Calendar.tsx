import { motion } from 'framer-motion'
import { useState } from 'react'

type Day = { date: Date; isCurrentMonth: boolean }
type Marker = string | { date: string; title?: string; content?: string; type?: string }

export default function Calendar({ year, month, markers = [] }: { year: number; month: number; markers?: Marker[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  
  const first = new Date(year, month, 1)
  const start = new Date(first)
  start.setDate(1 - ((first.getDay() + 6) % 7)) // start on Monday
  const days: Day[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push({ date: d, isCurrentMonth: d.getMonth() === month })
  }

  const fmt = (d: Date) => d.toISOString().split('T')[0]

  // normalize markers into map: dateStr -> array of {title, content, type}
  const map = new Map<string, { title?: string; content?: string; type?: string }[]>()
  markers.forEach((m) => {
    if (!m) return
    if (typeof m === 'string') {
      const key = m.split('T')[0]
      const arr = map.get(key) || []
      arr.push({ title: undefined, content: undefined, type: undefined })
      map.set(key, arr)
    } else if (typeof m === 'object') {
      const key = (m.date || '').split('T')[0]
      const arr = map.get(key) || []
      arr.push({ title: m.title, content: m.content, type: m.type })
      map.set(key, arr)
    }
  })

  const monthName = first.toLocaleString(undefined, { month: 'long' })
  const selectedEvents = selectedDate ? map.get(selectedDate) || [] : []

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Clean Professional Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-base font-bold !text-white">{monthName} {year}</h3>
          </div>
          <div className="text-[10px] text-white/90 bg-white/20 px-2.5 py-1 rounded-md font-semibold">
            {markers.length} events
          </div>
        </div>
      </div>

      {/* Compact Calendar Grid */}
      <div className="p-3">
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday Headers */}
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((w) => (
            <div key={w} className="text-center py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              {w}
            </div>
          ))}

          {/* Day Cells */}
          {days.map((d, idx) => {
            const key = fmt(d.date)
            const items = map.get(key) || []
            const isToday = key === fmt(new Date())
            const hasEvents = items.length > 0
            
            return (
              <motion.div 
                key={idx}
                onClick={() => hasEvents && setSelectedDate(key)}
                whileHover={hasEvents || d.isCurrentMonth ? { scale: 1.08 } : {}}
                whileTap={hasEvents ? { scale: 0.95 } : {}}
                className={`
                  aspect-square flex flex-col items-center justify-center p-1.5 rounded-lg transition-all cursor-pointer relative
                  ${d.isCurrentMonth 
                    ? hasEvents
                      ? 'bg-[var(--primary)] text-white hover:bg-[var(--secondary)] font-semibold shadow-sm hover:shadow-md'
                      : isToday
                      ? 'bg-[var(--accent)] text-white font-bold shadow-md ring-2 ring-[var(--accent)]/30 ring-offset-1'
                      : 'text-gray-700 hover:bg-gray-100 font-medium'
                    : 'text-gray-300 font-normal'
                  }
                  ${selectedDate === key ? 'ring-2 ring-[var(--accent)] ring-offset-1' : ''}
                `}
              >
                <span className="text-xs leading-none">{d.date.getDate()}</span>
                {hasEvents && d.isCurrentMonth && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {items.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full bg-white/80"></div>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Event Details Panel */}
      {selectedDate && selectedEvents.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 bg-gradient-to-b from-blue-50/30 to-white"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-[var(--primary)] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h4>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedEvents.map((event, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-3 border border-gray-200 hover:border-[var(--primary)]/30 hover:shadow-sm transition-all"
                >
                  <div className="font-semibold text-sm text-gray-900 mb-1 flex items-start gap-2">
                    <svg className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{event.title || 'Event'}</span>
                  </div>
                  {event.content && (
                    <div className="text-xs text-gray-600 ml-6 mb-2">
                      {event.content}
                    </div>
                  )}
                  {event.type && (
                    <div className="flex items-center gap-1 text-xs text-[var(--primary)] ml-6 bg-[var(--primary)]/5 px-2 py-1 rounded w-fit">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.type}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Simple Footer */}
      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[var(--primary)]"></div>
            <span className="text-gray-600">Has Events</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[var(--accent)]"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>
        <span className="text-gray-500 italic">Click dates to view details</span>
      </div>
    </div>
  )
}
