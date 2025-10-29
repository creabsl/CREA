import { motion } from 'framer-motion'
import { useState } from 'react'

interface BreakingNewsProps {
  title: string
  content: string
  date: string
  location: string
}

export default function BreakingNews({ title, content, date, location }: BreakingNewsProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      className="relative"
    >
      {/* Professional Alert Banner */}
      <div className="rounded-lg border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm">
        <div className="flex items-start gap-4">
          {/* Animated Alert Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-2xl"
          >
            🚨
          </motion.div>
          
          <div className="flex-1">
            {/* Breaking News Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            >
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                BREAKING
              </span>
              <span className="text-amber-800 font-bold text-sm">
                Breaking News
              </span>
            </motion.div>
            
            {/* News Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="text-amber-900 font-semibold text-lg mb-1">
                {title}
              </h3>
              <p className="text-amber-800 text-sm mb-2">
                {content}
              </p>
              <div className="flex items-center gap-4 text-xs text-amber-700">
                <span>📅 {new Date(date).toLocaleDateString()}</span>
                <span>📍 {location}</span>
              </div>
            </motion.div>
          </div>
          
          {/* Close Button */}
          <motion.button
            onClick={() => setIsVisible(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-amber-600 hover:text-amber-800 transition-colors"
          >
            ✕
          </motion.button>
        </div>
        
        {/* Animated Border Pulse */}
        <motion.div
          className="absolute inset-0 border-2 border-amber-400 rounded-lg"
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.005, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  )
}
