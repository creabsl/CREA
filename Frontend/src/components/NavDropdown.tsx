import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TWEEN } from '../animations'
import { ArrowDownIcon } from './Icons'

type Item = { to: string; label: string }

export default function NavDropdown({ label, items }: { label: string; items: Item[] }) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function onDoc(e: MouseEvent) {
			if (!ref.current) return
			if (!ref.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('click', onDoc)
		return () => document.removeEventListener('click', onDoc)
	}, [])

	return (
		<div className="relative" ref={ref}>
			<button
				type="button"
				className="px-3 py-2 rounded-md text-sm font-medium text-[var(--primary)] hover:bg-gray-50 no-underline inline-flex items-center gap-1"
				onClick={() => setOpen((o) => !o)}
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
						className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-md py-1 z-50"
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
								onClick={() => setOpen(false)}
								className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline"
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
