import { motion } from 'framer-motion'
import { SPRING, TWEEN } from '../animations'
import type { ReactNode } from 'react'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 }
}

const pageTransition = { ...SPRING.entrance, ...TWEEN.page }

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}
