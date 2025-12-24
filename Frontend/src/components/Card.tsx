import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '../animations'

export default function Card({ title, children, className = '', delay = 0 }: { 
  title?: ReactNode; 
  children?: ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
  <motion.div 
  className={`card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
    duration: 0.35, 
        delay,
    ...SPRING.entrance
      }}
      whileHover={{
    y: -1,
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
    transition: SPRING.hover
      }}
    >
      {title && (
        <div className="border-b border-default px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </motion.div>
  )
}
