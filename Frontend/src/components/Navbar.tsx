import { NavLink, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION, TWEEN } from '../animations'
import logo from '../assets/crea-logo.svg'
import EnhancedNavLink from './EnhancedNavLink'
import NavDropdown from './NavDropdown'
import { useAuth } from '../context/auth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium no-underline ${isActive ? 'bg-blue-900 text-white' : 'text-blue-900 hover:bg-blue-50'}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onDoc(e: MouseEvent){
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="CREA" className="h-8 w-8" />
            <span className="text-blue-900 font-semibold">Central Railway Engineers Association</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <EnhancedNavLink to="/" end>Dashboard</EnhancedNavLink>
            <EnhancedNavLink to="/events">Events</EnhancedNavLink>
            <EnhancedNavLink to="/documents">Documents</EnhancedNavLink>
            <EnhancedNavLink to="/apply-membership">Membership</EnhancedNavLink>
            {/* <EnhancedNavLink to=""></EnhancedNavLink> */}
            <EnhancedNavLink to="/mutual-transfers">Mutual Transfers</EnhancedNavLink>
            {/* Compact Community dropdown for non-essential links */}
            <NavDropdown label="Community" items={[
              { to: '/forum', label: 'Forum' },
              { to: '/suggestions', label: 'Suggestions' },
              { to: '/external-links', label: 'External Links' },
              { to: '/body-details', label: 'Association Body' },
            ]} />
            {!user ? (
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            ) : (
              <div className="relative" ref={menuRef}>
                <button onClick={()=>setMenuOpen(o=>!o)} className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-50">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white font-semibold">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                  <span className="text-sm text-blue-900 font-medium">{user.name}</span>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md py-1 z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={TWEEN.fast}
                    >
                      {user.role==='admin' && <Link to="/admin" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline" onClick={()=>setMenuOpen(false)}>Admin</Link>}
                      <Link to="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline" onClick={()=>setMenuOpen(false)}>Profile</Link>
                      <Link to="/files" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline" onClick={()=>setMenuOpen(false)}>Files</Link>
                      <hr className="my-1" />
                      <button onClick={logout} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <button className="md:hidden rounded-md p-2 hover:bg-gray-100" onClick={()=>setOpen(o=>!o)} aria-label="Toggle navigation">
            ☰
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div 
              className="md:hidden pb-4 flex flex-col gap-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: DURATION.standard }}
            >
              <NavLink to="/" className={navLinkClass} end onClick={()=>setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/events" className={navLinkClass} onClick={()=>setOpen(false)}>Events</NavLink>

              {/* Documents: direct link to All Documents */}
              <NavLink to="/documents" className={navLinkClass} onClick={()=>setOpen(false)}>Documents</NavLink>

              <div className="mt-2 px-1 text-xs font-semibold text-gray-500">Community</div>
              <NavLink to="/forum" className={navLinkClass} onClick={()=>setOpen(false)}>Forum</NavLink>
              <NavLink to="/suggestions" className={navLinkClass} onClick={()=>setOpen(false)}>Suggestions</NavLink>
              <NavLink to="/external-links" className={navLinkClass} onClick={()=>setOpen(false)}>External Links</NavLink>

              <div className="mt-2 px-1 text-xs font-semibold text-gray-500">Membership</div>
              <NavLink to="/apply-membership" className={navLinkClass} onClick={()=>setOpen(false)}>Apply</NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={()=>setOpen(false)}>Profile</NavLink>

              <div className="mt-2 px-1 text-xs font-semibold text-gray-500">More</div>
              <NavLink to="/body-details" className={navLinkClass} onClick={()=>setOpen(false)}>Association Body</NavLink>
              <NavLink to="/mutual-transfers" className={navLinkClass} onClick={()=>setOpen(false)}>Mutual Transfers</NavLink>
              {!user ? (
                <NavLink to="/login" className={navLinkClass} onClick={()=>setOpen(false)}>Login</NavLink>
              ) : (
                <>
                  {user.role==='admin' && <NavLink to="/admin" className={navLinkClass} onClick={()=>setOpen(false)}>Admin</NavLink>}
                  <NavLink to="/profile" className={navLinkClass} onClick={()=>setOpen(false)}>Profile</NavLink>
                  <NavLink to="/files" className={navLinkClass} onClick={()=>setOpen(false)}>Files</NavLink>
                  <button onClick={()=>{ logout(); setOpen(false) }} className="px-3 py-2 rounded-md text-left text-sm font-medium text-blue-900 hover:bg-blue-50">Logout</button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
