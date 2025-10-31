type Day = { date: Date; isCurrentMonth: boolean }

type Marker = string | { date: string; title?: string; content?: string; type?: string }

export default function Calendar({ year, month, markers = [] }: { year: number; month: number; markers?: Marker[] }) {
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

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-visible">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[#1a4d8f] px-5 py-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold !text-white tracking-wide drop-shadow-md">{monthName} {year}</h3>
          </div>
          <div className="flex items-center gap-2 !text-white text-xs bg-white/10 px-2.5 py-1.5 rounded-md backdrop-blur-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Hover for details</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday Headers */}
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((w) => (
            <div key={w} className="text-center py-3 font-semibold text-[var(--secondary)] text-sm uppercase tracking-wide">
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
              <div 
                key={idx} 
                className={`
                  min-h-[90px] rounded-lg p-2.5 transition-all duration-200 relative group
                  ${d.isCurrentMonth 
                    ? 'bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-md' 
                    : 'bg-gray-50/50 text-gray-400 border border-gray-100'
                  }
                  ${isToday ? 'ring-2 ring-[var(--accent)] ring-offset-1 bg-amber-50/30' : ''}
                  ${hasEvents ? 'cursor-pointer' : ''}
                `}
              >
                {/* Date Number */}
                <div className="flex items-start justify-between mb-1.5">
                  <span className={`
                    text-sm font-semibold
                    ${isToday 
                      ? 'flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent)] text-white shadow-sm' 
                      : d.isCurrentMonth ? 'text-[var(--primary)]' : 'text-gray-400'
                    }
                  `}>
                    {d.date.getDate()}
                  </span>
                  
                  {/* Event Count Badge */}
                  {hasEvents && (
                    <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-[var(--accent)] text-white shadow-sm">
                      {items.length}
                    </span>
                  )}
                </div>

                {/* Event Dots Preview */}
                {hasEvents && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {items.slice(0, 3).map((item, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"
                        title={item.title || 'Event'}
                      />
                    ))}
                    {items.length > 3 && (
                      <span className="text-[9px] text-[var(--secondary)] font-medium ml-0.5">
                        +{items.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Enhanced Hover Tooltip - Position ABOVE the cell */}
                {hasEvents && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                    <div className="w-72 max-w-[90vw]">
                      {/* Tooltip Arrow */}
                      <div className="w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45 mx-auto mb-[-6px] relative z-10"></div>
                      
                      {/* Tooltip Content */}
                      <div className="rounded-lg bg-white border border-gray-200 shadow-2xl overflow-hidden">
                        {/* Tooltip Header */}
                        <div className="bg-gradient-to-r from-[var(--primary)] to-[#1a4d8f] px-3.5 py-2.5 text-white">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold text-sm">
                              {d.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/90 mt-0.5 ml-6">{items.length} event{items.length !== 1 ? 's' : ''} scheduled</p>
                        </div>

                        {/* Events List */}
                        <div className="max-h-56 overflow-y-auto">
                          {items.map((item, i) => (
                            <div 
                              key={i} 
                              className="px-3.5 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start gap-2.5">
                                {/* Event Icon */}
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mt-0.5">
                                  <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                  </svg>
                                </div>
                                
                                {/* Event Details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-[var(--primary)] text-xs mb-0.5 leading-tight">
                                    {item.title || 'Event'}
                                  </h4>
                                  {item.content && (
                                    <p className="text-[10px] text-[var(--secondary)] line-clamp-2 leading-relaxed">
                                      {item.content}
                                    </p>
                                  )}
                                  {item.type && (
                                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[9px] font-medium">
                                      {item.type}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Tooltip Footer (if more than 3 events) */}
                        {items.length > 3 && (
                          <div className="px-3.5 py-2 bg-gray-50 text-center border-t border-gray-100">
                            <span className="text-[10px] text-[var(--secondary)] font-medium">
                              Showing all {items.length} events
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-xs">
                {new Date().getDate()}
              </div>
              <span className="text-[var(--secondary)]">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
              <span className="text-[var(--secondary)]">Has Events</span>
            </div>
          </div>
          <div className="text-[var(--secondary)]">
            Total Events: <span className="font-semibold text-[var(--primary)]">{markers.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
