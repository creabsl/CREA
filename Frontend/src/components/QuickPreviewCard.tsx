import { motion } from 'framer-motion'
import Button from './Button'
import type { ReactNode } from 'react'

interface QuickPreviewItem {
  id: string
  title: string
  subtitle: string
  date?: string
}

interface QuickPreviewCardProps {
  title: string
  items: QuickPreviewItem[]
  icon: ReactNode
  onViewAll: () => void
  delay?: number
}

export default function QuickPreviewCard({ 
  title, 
  items, 
  icon, 
  onViewAll, 
  delay = 0 
}: QuickPreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: delay * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={{ 
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 20 }
      }}
  className="surface rounded-xl border border-default shadow-sm hover:shadow-lg transition-all duration-300 h-full"
    >
      {/* Card Header */}
  <div className="p-4 border-b border-default">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-10 h-10 bg-brand-700 rounded-lg flex items-center justify-center text-white text-lg"
          >
            {icon}
          </motion.div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="space-y-3">
          {items.slice(0, 2).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (delay * 0.1) + (index * 0.1) }}
              whileHover={{ 
                x: 4,
                scale: 1.02,
                backgroundColor: "rgba(14, 44, 84, 0.03)",
                transition: { type: "spring", stiffness: 400 }
              }}
              className="p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent hover:border-[var(--primary)]/20 hover:shadow-sm"
            >
              <div className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                {item.title}
              </div>
              {item.subtitle && (
                <div className="text-xs text-gray-600 line-clamp-1 mb-1">
                  {item.subtitle}
                </div>
              )}
              {item.date && (
                <div className="text-xs text-[var(--accent)] font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </motion.div>
          ))}
          
          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay * 0.1 }}
              className="text-center py-6 text-gray-500"
            >
              <div className="text-2xl mb-2">•</div>
              <div className="text-sm">No {title.toLowerCase()} yet.</div>
            </motion.div>
          )}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (delay * 0.1) + 0.3 }}
          className="mt-4 pt-3 border-t border-gray-100"
        >
          <Button
            variant="ghost"
            onClick={onViewAll}
            className="w-full text-brand hover:bg-brand-50 font-medium"
          >
            View All {title} →
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
