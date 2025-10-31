import { motion } from 'framer-motion'

export default function TrainLoader({ size = 60 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size * 3, height: size * 1.5 }}>
      {/* Railway tracks */}
      <div className="relative w-full mb-2">
        <div className="absolute bottom-0 w-full border-b-2 border-gray-400"></div>
        <div className="absolute bottom-1 w-full border-b border-gray-300"></div>
        {/* Railway ties */}
        <div className="flex justify-between absolute bottom-0 w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1 h-3 bg-gray-400"></div>
          ))}
        </div>
      </div>
      
      {/* Steam engine */}
      <motion.div
        className="relative"
        animate={{ x: [-size * 1.2, size * 1.2] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Engine body */}
        <div className="flex items-end">
          {/* Chimney */}
          <div className="w-2 h-6 bg-gray-700 rounded-t-sm mr-1"></div>
          {/* Main body */}
          <div className="w-8 h-4 bg-[var(--primary)] rounded-sm relative">
            {/* Window */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-sm"></div>
          </div>
          {/* Coal car */}
          <div className="w-6 h-3 bg-gray-600 rounded-sm ml-1"></div>
        </div>
        
        {/* Wheels */}
        <div className="flex justify-between mt-1 px-1">
          <motion.div
            className="w-2 h-2 bg-gray-800 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-800 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-800 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.65, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Steam puffs */}
        <motion.div
          className="absolute -top-2 left-0"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 1.5],
            y: [0, -10, -20]
          }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        >
          <div className="w-3 h-3 bg-gray-300 rounded-full opacity-60"></div>
        </motion.div>
        <motion.div
          className="absolute -top-2 left-1"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 1.5],
            y: [0, -8, -16]
          }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
        >
          <div className="w-2 h-2 bg-gray-300 rounded-full opacity-40"></div>
        </motion.div>
        <motion.div
          className="absolute -top-2 left-2"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 1.5],
            y: [0, -6, -12]
          }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
        >
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full opacity-30"></div>
        </motion.div>
      </motion.div>
      
      {/* Loading text */}
      <motion.div
        className="text-sm text-[var(--primary)] font-medium mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        Loading...
      </motion.div>
    </div>
  )
}
