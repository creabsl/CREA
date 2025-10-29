import { motion } from 'framer-motion'
import Button from './Button'
import { MembershipIcon, DocumentIcon } from './Icons'

interface QuickLinksProps {
  onApplyMembership: () => void
  onViewManuals: () => void
}

export default function QuickLinks({ onApplyMembership, onViewManuals }: QuickLinksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="surface rounded-xl border border-default shadow-sm p-6"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-xl">•</span>
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        {/* Apply Membership Button */}
        <motion.div
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Button
            variant="primary"
            onClick={onApplyMembership}
            className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <MembershipIcon />
            Apply Membership
          </Button>
        </motion.div>

        {/* Access Manuals Button */}
        <motion.div
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Button
            variant="ghost"
            onClick={onViewManuals}
            className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 border-2 border-default hover:bg-brand-50"
          >
            <DocumentIcon />
            Access Manuals
          </Button>
        </motion.div>

        {/* Additional Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
      className="pt-3 border-t border-default"
        >
          <div className="grid grid-cols-2 gap-2 text-xs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
        className="p-2 text-gray-600 hover:text-brand hover:bg-brand-50 rounded-md transition-colors"
            >
        Contact
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
        className="p-2 text-gray-600 hover:text-brand hover:bg-brand-50 rounded-md transition-colors"
            >
        Support
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
