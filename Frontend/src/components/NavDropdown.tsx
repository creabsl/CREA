import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TWEEN } from '../animations'
import { ArrowDownIcon } from './Icons'

type Item = { to: string; label: string }

export default function NavDropdown({ label, items }: { label: string; items: Item[] }) {
	const [open, setOpen] = useState(false)

	return (
		<div 
			className="relative" 
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			<button
				type="button"
				className="px-3 py-2 rounded-md text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors no-underline inline-flex items-center gap-1"
				aria-haspopup="menu"
				aria-expanded={open}
			>
				{label}
				<motion.span
					className="ml-1 select-none inline-flex"
					initial={false}
					animate={{ rotate: open ? 180 : 0 }}
					transition={TWEEN.fast}
					aria-hidden="true"
				>
					<ArrowDownIcon size={16} />
				</motion.span>
			</button>
			<AnimatePresence>
				{open && (
					<motion.div
						className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg py-1 z-50"
						initial={{ opacity: 0, scale: 0.95, y: -8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -8 }}
						transition={TWEEN.fast}
						role="menu"
					>
						{items.map((it) => (
							<Link
								key={it.to}
								to={it.to}
								className="block px-4 py-2.5 text-sm text-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] font-medium transition-colors no-underline"
								role="menuitem"
							>
								{it.label}
							</Link>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
