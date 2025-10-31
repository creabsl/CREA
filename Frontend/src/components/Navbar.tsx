import { NavLink, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION, TWEEN } from '../animations'
import logo from '../assets/crea-logo.svg'
import EnhancedNavLink from './EnhancedNavLink'
import NavDropdown from './NavDropdown'
import { useAuth } from '../context/auth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium no-underline ${isActive ? 'bg-[var(--primary)] !text-white' : 'text-[var(--primary)] hover:bg-gray-100'}`

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
    /*
      NAVBAR CONTAINER CHANGES:
      1. Added 'sticky top-0' back to make it permanent.
      2. Kept 'py-4 z-50' to provide spacing.
    */
  <nav className="sticky top-0 py-4 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/*
          "PILL" DIV CHANGES (DESKTOP):
          1. Changed 'md:bg-surface' to 'md:bg-brand-50/90' (our new color, 90% opacity).
          2. Added 'md:backdrop-blur-lg' for the "a lot blurrier" effect.
          3. Kept 'md:rounded-full md:shadow-lg md:px-6' for the pill shape.
        */}
          <div className="flex h-16 items-center justify-between md:bg-white/80 md:backdrop-blur-xl md:rounded-full md:shadow-xl md:px-6">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="CREA" className="h-8 w-8" />
            <span className="text-brand-900 font-semibold hidden lg:block">Central Railway Engineers Association</span>
          </Link>

          {/* This section (desktop links) is unchanged and will be inside the pill */}
          <div className="hidden md:flex items-center gap-2">
            <EnhancedNavLink to="/" end>Dashboard</EnhancedNavLink>
            <EnhancedNavLink to="/about">About</EnhancedNavLink>
            <EnhancedNavLink to="/events">Events</EnhancedNavLink>
            <EnhancedNavLink to="/documents">Documents</EnhancedNavLink>
            <EnhancedNavLink to="/apply-membership">Membership</EnhancedNavLink>
            <NavDropdown label="Community" items={[
              { to: '/forum', label: 'Forum' },
              { to: '/mutual-transfers', label: 'Mutual Transfers' },
              { to: '/suggestions', label: 'Suggestions' },
              { to: '/external-links', label: 'External Links' },
              { to: '/body-details', label: 'Association Body' },
            ]} />
            
            {/* --- AUTH LOGIC IS UNTOUCHED --- */}
            {!user ? (
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
            ) : (
              <div className="relative" ref={menuRef}>
                <button onClick={()=>setMenuOpen(o=>!o)} className="flex items-center gap-2 rounded-full border border-brand-900 border-opacity-10 px-2 py-1 hover:bg-brand-50">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-white font-semibold">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                  <span className="text-sm text-brand-900 font-medium">{user.name}</span>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-xl p-1 z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }} 
                      transition={TWEEN.fast}
                    >
                      {user.role==='admin' && <Link to="/admin" className="block px-3 py-2 text-sm rounded-lg text-[var(--primary)] hover:bg-gray-100 no-underline" onClick={()=>setMenuOpen(false)}>Admin</Link>}
                      <Link to="/profile" className="block px-3 py-2 text-sm rounded-lg text-[var(--primary)] hover:bg-gray-100 no-underline" onClick={()=>setMenuOpen(false)}>Profile</Link>
                      <Link to="/files" className="block px-3 py-2 text-sm rounded-lg text-[var(--primary)] hover:bg-gray-100 no-underline" onClick={()=>setMenuOpen(false)}>Files</Link>
                      <hr className="my-1 border-t border-gray-200" />
                      <button onClick={logout} className="block w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50">Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* Mobile menu button (unchanged) */}
          <button className="md:hidden rounded-md p-2 hover:bg-brand-50" onClick={()=>setOpen(o=>!o)} aria-label="Toggle navigation">
            ☰
          </button>
        </div>
        
        {/* Mobile menu (unchanged and will work perfectly) */}
        <AnimatePresence>
          {open && (
            <motion.div 
              /*
                MOBILE MENU CHANGES:
                1. Changed 'bg-surface' to 'bg-brand-50/90' (our new color, 90% opacity).
                2. Added 'backdrop-blur-lg' for the blur effect.
                3. Kept 'shadow-lg rounded-lg p-4 mt-4'
              */
              className="md:hidden pb-4 flex flex-col gap-1 bg-white/80 backdrop-blur-xl shadow-xl rounded-lg p-4 mt-4"
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: DURATION.standard }}
            >
              <NavLink to="/" className={navLinkClass} end onClick={()=>setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={()=>setOpen(false)}>About</NavLink>
              <NavLink to="/events" className={navLinkClass} onClick={()=>setOpen(false)}>Events</NavLink>
              <NavLink to="/documents" className={navLinkClass} onClick={()=>setOpen(false)}>Documents</NavLink>
              <NavLink to="/apply-membership" className={navLinkClass} onClick={()=>setOpen(false)}>Membership</NavLink>
              
              <div className="mt-2 px-1 text-xs font-semibold text-gray-500">Community</div>
              <NavLink to="/forum" className={navLinkClass} onClick={()=>setOpen(false)}>Forum</NavLink>
              <NavLink to="/mutual-transfers" className={navLinkClass} onClick={()=>setOpen(false)}>Mutual Transfers</NavLink>
              <NavLink to="/suggestions" className={navLinkClass} onClick={()=>setOpen(false)}>Suggestions</NavLink>
              <NavLink to="/external-links" className={navLinkClass} onClick={()=>setOpen(false)}>External Links</NavLink>
              <NavLink to="/body-details" className={navLinkClass} onClick={()=>setOpen(false)}>Association Body</NavLink>
              
              {!user ? (
                <NavLink to="/login" className={navLinkClass} onClick={()=>setOpen(false)}>Login</NavLink>
              ) : (
                <>
                  {user.role === 'admin' && <NavLink to="/admin" className={navLinkClass} onClick={()=>setOpen(false)}>Admin</NavLink>}
                  <NavLink to="/profile" className={navLinkClass} onClick={()=>setOpen(false)}>Profile</NavLink>
                  <NavLink to="/files" className={navLinkClass} onClick={()=>setOpen(false)}>Files</NavLink>
                  <button onClick={() => { logout(); setOpen(false); }} className="text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">Logout</button>
                </>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}