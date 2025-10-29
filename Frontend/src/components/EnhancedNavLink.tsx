import { NavLink as RouterNavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SPRING } from '../animations'
import type { ReactNode } from 'react'

interface EnhancedNavLinkProps {
  to: string
  children: ReactNode
  end?: boolean
}

export default function EnhancedNavLink({ to, children, end }: EnhancedNavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 no-underline ${
          isActive
            ? 'bg-blue-900 text-white shadow-lg'
            : 'text-blue-900 hover:bg-blue-50'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <motion.span
            whileHover={{ scale: 1.01, transition: SPRING.hover }}
            whileTap={{ scale: 0.99, transition: SPRING.press }}
            className="relative z-10"
          >
            {children}
          </motion.span>

          {/* Active background glow */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-blue-900 rounded-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SPRING.entrance}
              style={{ zIndex: -1 }}
            />
          )}
        </>
      )}
    </RouterNavLink>
  )
}
