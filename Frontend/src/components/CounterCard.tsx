import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CounterCardProps {
  label: string
  value: number
  delay?: number
  icon?: React.ReactNode
}

export default function CounterCard({ label, value, delay = 0, icon }: CounterCardProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest))
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const unsubscribe = rounded.onChange(setDisplayValue)
    return unsubscribe
  }, [rounded])

  useEffect(() => {
    const timer = setTimeout(() => {
      animate(count, value, { 
        duration: 2, 
        ease: "easeOut",
        type: "spring",
        stiffness: 50,
        damping: 20
      })
    }, delay * 300)
    
    return () => clearTimeout(timer)
  }, [count, value, delay])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: delay * 0.15, 
        type: "spring",
        stiffness: 300,
        damping: 24
      }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        transition: { type: "spring", stiffness: 400, damping: 20 }
      }}
      className="surface rounded-xl border border-default shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6 text-center">
        {icon && <div className="text-2xl mb-2">{icon}</div>}
        <motion.div 
          className="text-3xl font-bold text-brand-900 mb-2"
          animate={{ 
            scale: displayValue > 0 ? [1, 1.1, 1] : 1 
          }}
          transition={{ duration: 0.3 }}
        >
          {displayValue.toLocaleString()}
        </motion.div>
        <div className="text-sm text-gray-600 font-medium">{label}</div>
      </div>
    </motion.div>
  )
}
