import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION, SPRING } from '../animations'

export default function Modal({ open, onClose, title, children }: { 
  open: boolean; 
  onClose: () => void; 
  title?: ReactNode; 
  children?: ReactNode 
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/40" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.quick }}
          />
          
          {/* Modal content */}
          <motion.div 
            className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-lg my-8 max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ ...SPRING.overlay, duration: DURATION.slow }}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-default px-4 py-3 flex-shrink-0">
                <h3 className="text-base font-semibold text-brand-900">{title}</h3>
                <motion.button 
                  onClick={onClose} 
                  className="text-gray-500 hover:text-gray-700 rounded-md p-1"
                  whileHover={{ scale: 1.05, transition: SPRING.hover }}
                  whileTap={{ scale: 0.95, transition: SPRING.press }}
                >
                  <span aria-hidden>✕</span>
                  <span className="sr-only">Close modal</span>
                </motion.button>
              </div>
            )}
            <div className="p-4 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
