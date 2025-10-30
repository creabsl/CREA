type Day = { date: Date; isCurrentMonth: boolean }

type Marker = string | { date: string; title?: string; content?: string }

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

  // normalize markers into map: dateStr -> array of {title, content}
  const map = new Map<string, { title?: string; content?: string }[]>()
  markers.forEach((m) => {
    if (!m) return
    if (typeof m === 'string') {
      const key = m.split('T')[0]
      const arr = map.get(key) || []
      arr.push({ title: undefined, content: undefined })
      map.set(key, arr)
    } else if (typeof m === 'object') {
      const key = (m.date || '').split('T')[0]
      const arr = map.get(key) || []
      arr.push({ title: m.title, content: m.content })
      map.set(key, arr)
    }
  })

  const monthName = first.toLocaleString(undefined, { month: 'long' })

  return (
    <div className="rounded-md border bg-white text-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="text-sm font-semibold text-gray-700">{monthName} {year}</div>
        <div className="text-xs text-gray-500">Click a date for details. Hover to preview.</div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((w) => (
          <div key={w} className="bg-gray-50 px-2 py-2 text-center font-semibold text-gray-700 text-xs">{w}</div>
        ))}

        {days.map((d, idx) => {
          const key = fmt(d.date)
          const items = map.get(key) || []
          const isToday = key === fmt(new Date())
          return (
            <div key={idx} className={`min-h-20 bg-white p-2 ${d.isCurrentMonth ? '' : 'bg-gray-50 text-gray-400'} relative group`}>
              <div className="flex items-start justify-between">
                <span className={`text-sm font-medium ${isToday ? 'text-blue-900' : 'text-gray-700'}`}>{d.date.getDate()}</span>
                <div className="flex items-center gap-1">
                  {items.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">{items.length}</span>
                  )}
                </div>
              </div>

              {/* hover tooltip */}
              {items.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 w-64">
                  <div className="rounded-md bg-white border shadow-lg p-2 text-xs">
                    {items.slice(0, 4).map((it, i) => (
                      <div key={i} className="py-1 border-b last:border-b-0">
                        <div className="font-semibold text-gray-800">{it.title ?? 'Event'}</div>
                        {it.content && <div className="text-gray-600">{it.content}</div>}
                      </div>
                    ))}
                    {items.length > 4 && <div className="text-xs text-gray-500 mt-1">+{items.length - 4} more</div>}
                  </div>
                </div>
              )}

            </div>
          )
        })}
      </div>
    </div>
  )
}
