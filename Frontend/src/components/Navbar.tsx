import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TWEEN } from "../animations";
import logo from "../assets/crea-logo.svg";
import NavDropdown from "./NavDropdown";
import { useAuth } from "../context/auth";
import {
  getPendingForumPosts,
  getPendingForumComments,
  getUnreadNotificationCount,
} from "../services/api";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 text-sm font-medium no-underline transition-all ${
    isActive
      ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
      : "text-gray-700 hover:text-[var(--primary)] hover:border-b-2 hover:border-gray-300"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [userNotifCount, setUserNotifCount] = useState(0);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // Load pending forum items count for admin
  useEffect(() => {
    if (user?.role === "admin") {
      const loadPendingCount = async () => {
        try {
          const [posts, comments] = await Promise.all([
            getPendingForumPosts(),
            getPendingForumComments(),
          ]);
          setPendingCount(posts.length + comments.length);
        } catch (error) {
          console.error("Error loading pending count:", error);
        }
      };
      loadPendingCount();
      // Refresh every 30 seconds
      const interval = setInterval(loadPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Load user notification count
  useEffect(() => {
    if (user) {
      const loadUserNotifications = async () => {
        try {
          const { count } = await getUnreadNotificationCount();
          setUserNotifCount(count);
        } catch (error) {
          console.error("Error loading user notifications:", error);
        }
      };
      loadUserNotifications();
      // Refresh every 10 seconds
      const interval = setInterval(loadUserNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      {/* Top Info Bar - Government Style */}
      <div className="bg-gradient-to-r from-[#003d82] to-[#0a2343] text-white">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center py-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 hidden sm:block"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Central Railway HQ, Delhi</span>
              </div>
              <span className="hidden sm:inline text-white/40">•</span>
              <span className="hidden sm:inline">Since 1950</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <img
              src={logo}
              alt="CREA"
              className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
            />
            <div className="hidden md:block border-l-2 border-gray-300 pl-3">
              <div className="text-[var(--primary)] font-bold text-sm lg:text-base xl:text-lg leading-tight">
                Central Railway Engineers Association
              </div>
              <div className="text-gray-600 text-xs font-medium hidden lg:block">
                रेलवे अभियंता संघ
              </div>
            </div>
            <div className="block md:hidden">
              <div className="text-[var(--primary)] font-bold text-sm leading-tight">
                CREA
              </div>
              <div className="text-gray-600 text-[10px] font-medium">
                Engineers Assoc.
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              Events
            </NavLink>
            <NavLink to="/documents" className={navLinkClass}>
              Documents
            </NavLink>
            <NavLink to="/apply-membership" className={navLinkClass}>
              Membership
            </NavLink>
            <NavDropdown
              label="Community"
              items={[
                { to: "/forum", label: "Forum" },
                { to: "/mutual-transfers", label: "Mutual Transfers" },
                { to: "/suggestions", label: "Suggestions" },
                { to: "/external-links", label: "External Links" },
                { to: "/body-details", label: "Association Body" },
                { to: "/donations", label: "Donations" },
              ]}
            />
          </div>

          {/* User Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {!user ? (
              <Link
                to="/login"
                className="px-6 py-2 bg-[var(--accent)] text-[var(--text-dark)] rounded-md font-semibold hover:bg-[#d49500] transition-all"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {userNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {userNotifCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white font-semibold text-sm">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                    <span className="text-sm text-gray-700 font-medium max-w-[120px] truncate">
                      {user.name}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-2xl overflow-hidden z-50"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={TWEEN.fast}
                      >
                        <div className="bg-gradient-to-r from-[var(--primary)] to-[#1a4d8f] px-4 py-3">
                          <div className="text-white font-semibold truncate">
                            {user.name}
                          </div>
                          <div className="text-white/80 text-xs">
                            {user.email}
                          </div>
                        </div>

                        <div className="p-2">
                          {user.role === "admin" && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 no-underline"
                              onClick={() => setMenuOpen(false)}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Admin Panel
                            </Link>
                          )}
                          {user.role === "admin" && (
                            <Link
                              to="/forum-moderation"
                              className="flex items-center justify-between px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 no-underline"
                              onClick={() => setMenuOpen(false)}
                            >
                              <span className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                                Forum Moderation
                              </span>
                              {pendingCount > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                                  {pendingCount}
                                </span>
                              )}
                            </Link>
                          )}
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 no-underline"
                            onClick={() => setMenuOpen(false)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            My Profile
                          </Link>
                          <hr className="my-2 border-gray-200" />
                          <button
                            onClick={logout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile/Tablet User Actions */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-2">
            {user && (
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {userNotifCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-red-600 rounded-full">
                    {userNotifCount > 9 ? "9+" : userNotifCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Overlay backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            
            {/* Side drawer menu */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white shadow-2xl z-50 lg:hidden overflow-hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Header with close button */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#003d82] to-[#0a2343] shadow-md">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="CREA" className="h-10 w-10" />
                  <div>
                    <div className="text-white font-bold text-sm">CREA</div>
                    <div className="text-white/80 text-xs">Engineers Assoc.</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-5 py-4">
                  {/* User info section */}
                  {user && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-600 text-white font-bold text-xl shadow-lg ring-2 ring-white">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold text-gray-900 truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation links */}
                  <nav className="space-y-1.5">
                    {/* Main navigation */}
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                          isActive
                            ? "bg-[var(--primary)] text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`
                      }
                      end
                      onClick={() => setOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Home
                    </NavLink>
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                          isActive
                            ? "bg-[var(--primary)] text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About
                    </NavLink>
                    <NavLink
                      to="/events"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                          isActive
                            ? "bg-[var(--primary)] text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Events
                    </NavLink>
                    <NavLink
                      to="/documents"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                          isActive
                            ? "bg-[var(--primary)] text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Documents
                    </NavLink>
                    <NavLink
                      to="/apply-membership"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                          isActive
                            ? "bg-[var(--primary)] text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Membership
                    </NavLink>

                    {/* Community section */}
                    <div className="pt-4 pb-2">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
                        Community
                      </div>
                      <div className="space-y-1.5">
                        <NavLink
                          to="/forum"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                              isActive
                                ? "bg-[var(--primary)] text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                            }`
                          }
                          onClick={() => setOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Forum
                        </NavLink>
                        <NavLink
                          to="/mutual-transfers"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                              isActive
                                ? "bg-[var(--primary)] text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                            }`
                          }
                          onClick={() => setOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Mutual Transfers
                        </NavLink>
                        <NavLink
                          to="/suggestions"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                              isActive
                                ? "bg-[var(--primary)] text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                            }`
                          }
                          onClick={() => setOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Suggestions
                        </NavLink>
                        <NavLink
                          to="/external-links"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                              isActive
                                ? "bg-[var(--primary)] text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                            }`
                          }
                          onClick={() => setOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          External Links
                        </NavLink>
                        <NavLink
                          to="/body-details"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                              isActive
                                ? "bg-[var(--primary)] text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                            }`
                          }
                          onClick={() => setOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Association Body
                        </NavLink>
                        <NavLink
                          to="/donations"
                          className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                              isActive
                                ? "bg-[var(--primary)] text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                            }`
                          }
                          onClick={() => setOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Donations
                        </NavLink>
                      </div>
                    </div>

                    {/* Account section */}
                    {user && (
                      <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
                          Account
                        </div>
                        <div className="space-y-1.5">
                          {user.role === "admin" && (
                            <NavLink
                              to="/admin"
                              className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                                  isActive
                                    ? "bg-[var(--primary)] text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                                }`
                              }
                              onClick={() => setOpen(false)}
                            >
                              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Admin Panel
                            </NavLink>
                          )}
                          {user.role === "admin" && (
                            <NavLink
                              to="/forum-moderation"
                              className={({ isActive }) =>
                                `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                                  isActive
                                    ? "bg-[var(--primary)] text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                                }`
                              }
                              onClick={() => setOpen(false)}
                            >
                              <span className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Forum Moderation
                              </span>
                              {pendingCount > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full ml-2">
                                  {pendingCount}
                                </span>
                              )}
                            </NavLink>
                          )}
                          <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                              `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline ${
                                isActive
                                  ? "bg-[var(--primary)] text-white shadow-md"
                                  : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                              }`
                            }
                            onClick={() => setOpen(false)}
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            My Profile
                          </NavLink>
                        </div>
                      </div>
                    )}
                  </nav>
                </div>
              </div>

              {/* Footer with action buttons */}
              <div className="border-t border-gray-200 p-5 bg-gray-50">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg shadow-md transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-[var(--accent)] to-yellow-500 hover:from-yellow-500 hover:to-[var(--accent)] rounded-lg shadow-md transition-all active:scale-95 no-underline"
                    onClick={() => setOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
