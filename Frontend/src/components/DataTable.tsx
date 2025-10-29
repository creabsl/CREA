import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING, DURATION } from '../animations'

export type Column<T> = {
  key: keyof T
  header: string
  render?: (row: T) => React.ReactNode
}

export default function DataTable<T extends Record<string, unknown>>({ data, columns, initialQuery = '' }: { data: T[]; columns: Column<T>[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    if (!query.trim()) return data
    const q = query.toLowerCase()
    return data.filter((row) => Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q)))
  }, [data, query])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const arr = [...filtered]
    arr.sort((a,b) => {
      const av = String(a[sortKey] ?? '')
      const bv = String(b[sortKey] ?? '')
      return sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return arr
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page])

  const onSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(d => d==='asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <input
          placeholder="Search..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          className="input"
        />
        <div className="hidden sm:block text-xs text-gray-500 whitespace-nowrap">{filtered.length} result(s)</div>
      </div>
      <div className="overflow-x-auto rounded-md border border-default">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-brand-50/50">
            <tr>
              {columns.map((c) => {
                const key = c.key
                const active = sortKey===key
                return (
                  <th key={String(key)} className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <button className="inline-flex items-center gap-1 no-underline text-brand hover:text-brand-900" onClick={()=>onSort(key)}>
                      {c.header}
                      {active && <span>{sortDir==='asc'?'▲':'▼'}</span>}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            <AnimatePresence mode="popLayout">
      {current.map((row, idx) => (
                <motion.tr 
                  key={idx} 
                  className="hover:bg-brand-50/60"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
        duration: DURATION.standard,
        delay: Math.min(idx * 0.03, 0.18),
        ...SPRING.entrance,
                  }}
                  layout
                >
                  {columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap">
                      {c.render ? c.render(row) : String(row[c.key] ?? '')}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
            {current.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages>1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button className="rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-50" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <span className="text-gray-600">Page {page} of {totalPages}</span>
          <button className="rounded border px-2 py-1 hover:bg-gray-50 disabled:opacity-50" disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
        </div>
      )}
    </div>
  )
}
