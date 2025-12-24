import { motion, AnimatePresence } from 'framer-motion'

interface BreakingNewsProps {
  title: string
  content: string
  date: string
  location: string
  currentIndex: number
  totalCount: number
  onNavigate: (index: number) => void
}

export default function BreakingNews({ title, content, date, location, currentIndex, totalCount, onNavigate }: BreakingNewsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      {/* Modern Professional Breaking News Banner - Warm Color Theme */}
      <div className="relative rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 shadow-lg overflow-hidden border-2 border-[var(--accent)]">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(242,169,0,.1) 10px, rgba(242,169,0,.1) 20px)',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '20px 20px'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div className="relative z-10 p-5">
          {/* Header with Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Pulsing Icon */}
              <motion.div
                className="relative"
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <motion.div
                  className="absolute inset-0 bg-red-400/30 rounded-full"
                  animate={{
                    scale: [1, 1.8],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>

              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
                  Breaking
                </span>
                <span className="text-orange-700 font-bold text-sm">
                  Breaking News
                </span>
              </div>
            </div>

            {/* Counter and Navigation */}
            {totalCount > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs font-medium">
                  {currentIndex + 1} / {totalCount}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onNavigate((currentIndex - 1 + totalCount) % totalCount)}
                    className="w-7 h-7 rounded-full bg-orange-100 hover:bg-orange-200 transition-all flex items-center justify-center group"
                  >
                    <svg className="w-4 h-4 text-orange-700 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onNavigate((currentIndex + 1) % totalCount)}
                    className="w-7 h-7 rounded-full bg-orange-100 hover:bg-orange-200 transition-all flex items-center justify-center group"
                  >
                    <svg className="w-4 h-4 text-orange-700 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <h3 className="text-gray-900 font-bold text-xl md:text-2xl leading-tight">
                {title}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {content}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="inline-flex items-center gap-1.5 text-orange-700 text-xs font-medium bg-orange-100 px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-orange-700 text-xs font-medium bg-orange-100 px-3 py-1.5 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          {totalCount > 1 && (
            <div className="flex gap-1.5 mt-4">
              {Array.from({ length: totalCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(index)}
                  className="group relative h-1 flex-1 rounded-full overflow-hidden bg-orange-200"
                >
                  <motion.div
                    className="absolute inset-0 bg-orange-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: index === currentIndex ? 1 : 0 }}
                    transition={{ duration: index === currentIndex ? 5 : 0.3 }}
                    style={{ transformOrigin: 'left' }}
                  />
                  {index < currentIndex && (
                    <div className="absolute inset-0 bg-orange-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
