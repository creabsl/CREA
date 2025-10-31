import { NavLink, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Menu, X } from 'lucide-react'
import logo from '../assets/crea-logo.svg'
import EnhancedNavLink from './EnhancedNavLink'
import NavDropdown, { MobileNavDropdown } from './NavDropdown'
import { 
  DashboardIcon, 
  EventIcon, 
  ForumIcon, 
  AssociationBodyIcon,
  DocumentIcon,
  ExternalLinksIcon,
  MembershipIcon,
  SuggestionIcon,
  TransferIcon
} from './Icons'
import { useAuth } from '../context/auth'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive ? 'bg-[var(--primary)] text-white' : 'text-[var(--primary)] hover:bg-gray-50'}`

// Navigation structure with grouped items
const navigationGroups = {
  community: [
    { 
      to: '/events', 
      label: 'Events', 
      icon: <EventIcon size="sm" />,
      description: 'Upcoming events and announcements'
    },
    { 
      to: '/forum', 
      label: 'Forum', 
      icon: <ForumIcon size="sm" />,
      description: 'Discussion threads and community'
    },
    { 
      to: '/body-details', 
      label: 'Association Body', 
      icon: <AssociationBodyIcon size="sm" />,
      description: 'Meet the association leadership'
    }
  ],
  resources: [
    { 
      to: '/documents', 
      label: 'Documents', 
      icon: <DocumentIcon size="sm" />,
      description: 'Circulars, manuals, and court cases'
    },
    { 
      to: '/external-links', 
      label: 'External Links', 
      icon: <ExternalLinksIcon size="sm" />,
      description: 'Useful external resources and links'
    },
    { 
      to: '/mutual-transfers', 
      label: 'Mutual Transfers', 
      icon: <TransferIcon size="sm" />,
      description: 'Transfer requests and information'
    }
  ],
  services: [
    { 
      to: '/apply-membership', 
      label: 'Membership', 
      icon: <MembershipIcon size="sm" />,
      description: 'Apply for association membership'
    },
    { 
      to: '/suggestions', 
      label: 'Suggestions', 
      icon: <SuggestionIcon size="sm" />,
      description: 'Submit suggestions and feedback'
    }
  ]
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    function onDoc(e: MouseEvent){
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      {/* Brand stripe */}
      <div className="h-1 bg-gradient-to-r from-blue-950 via-amber-400 to-blue-950" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <motion.img 
              src={logo} 
              alt="CREA" 
              className="h-10 w-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
            <div className="hidden sm:block">
              <span className="text-[var(--primary)] font-bold text-lg">CREA Portal</span>
              <div className="text-xs text-gray-600">Central Railway Engineers Association</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <EnhancedNavLink to="/" end>
              <DashboardIcon size="sm" className="mr-2" />
              Dashboard
            </EnhancedNavLink>
            
            <NavDropdown 
              label="Community" 
              items={navigationGroups.community}
            />
            
            <NavDropdown 
              label="Resources" 
              items={navigationGroups.resources}
            />
            
            <NavDropdown 
              label="Services" 
              items={navigationGroups.services}
            />
          </div>

          {/* Search and User Menu */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:block relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[var(--primary)] hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-professional-lg border border-gray-200 p-4"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      placeholder="Search events, documents, forum..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      autoFocus
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Search across all portal content
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            {user && (
              <button className="p-2 text-[var(--primary)] hover:bg-gray-50 rounded-md transition-colors duration-200 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            )}

            {/* User Menu */}
            {!user ? (
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            ) : (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setMenuOpen(o => !o)} 
                  className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-950 to-blue-900 text-white font-semibold text-sm">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden sm:block text-sm text-[var(--primary)] font-medium">
                    {user.name}
                  </span>
                </button>
                
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-professional-lg py-2 z-50"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150" 
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="text-[var(--primary)]">⚙️</span>
                          Admin Panel
                        </Link>
                      )}
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150" 
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-[var(--primary)]">👤</span>
                        Profile
                      </Link>
                      <Link 
                        to="/files" 
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150" 
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-[var(--primary)]">📁</span>
                        My Files
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button 
                        onClick={logout} 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <span className="text-red-600">🚪</span>
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 rounded-md text-[var(--primary)] hover:bg-gray-50 transition-colors duration-200" 
              onClick={() => setOpen(o => !o)} 
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {open && (
            <motion.div 
              className="lg:hidden pb-4 border-t border-gray-200 mt-4 pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-2">
                <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
                  <DashboardIcon size="sm" className="mr-2" />
                  Dashboard
                </NavLink>
                
                <MobileNavDropdown 
                  label="Community" 
                  items={navigationGroups.community}
                />
                
                <MobileNavDropdown 
                  label="Resources" 
                  items={navigationGroups.resources}
                />
                
                <MobileNavDropdown 
                  label="Services" 
                  items={navigationGroups.services}
                />

                {!user ? (
                  <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
                    Login
                  </NavLink>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-1">
                    {user.role === 'admin' && (
                      <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
                        Admin Panel
                      </NavLink>
                    )}
                    <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>
                      Profile
                    </NavLink>
                    <NavLink to="/files" className={navLinkClass} onClick={() => setOpen(false)}>
                      My Files
                    </NavLink>
                    <button 
                      onClick={() => { logout(); setOpen(false) }} 
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
