import type { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { SPRING } from '../animations'
import Spinner from './Spinner'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
}

export default function Button({ variant = 'primary', className = '', children, onClick, disabled, type, loading = false }: Props) {
  const base = 'btn'
  const variants: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }
  
  return (
    <motion.button 
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      whileHover={{ 
        scale: 1.015,
        transition: SPRING.hover
      }}
      whileTap={{ 
        scale: 0.985,
        transition: SPRING.press
      }}
      initial={{ scale: 1 }}
    >
      <span className="inline-flex items-center gap-2">
        {loading && (
          // Subtle inline spinner to the left when loading
          <span className="-ml-1 inline-flex">
            <Spinner size={16} />
          </span>
        )}
        <span>{children}</span>
      </span>
    </motion.button>
  )
}
