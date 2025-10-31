import { motion } from 'framer-motion'
import TrainLoader from './TrainLoader'

export default function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <motion.div 
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TrainLoader size={80} />
      <motion.p 
        className="mt-4 text-lg text-[var(--primary)] font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </motion.div>
  )
}
