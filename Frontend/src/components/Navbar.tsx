import { NavLink, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DURATION, TWEEN } from "../animations";
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

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.standard }}
          >
            <div className="px-4 py-4 max-h-[calc(100vh-130px)] overflow-y-auto">
              {user && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-blue-600 text-white font-bold text-lg shadow-md">
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

              <nav className="space-y-1">
                <NavLink
                  to="/"
                  className={navLinkClass}
                  end
                  onClick={() => setOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  to="/events"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Events
                </NavLink>
                <NavLink
                  to="/documents"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Documents
                </NavLink>
                <NavLink
                  to="/apply-membership"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Membership
                </NavLink>

                <div className="pt-4 pb-2">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Community
                  </div>
                  <div className="space-y-1">
                    <NavLink
                      to="/forum"
                      className={navLinkClass}
                      onClick={() => setOpen(false)}
                    >
                      Forum
                    </NavLink>
                    <NavLink
                      to="/mutual-transfers"
                      className={navLinkClass}
                      onClick={() => setOpen(false)}
                    >
                      Mutual Transfers
                    </NavLink>
                    <NavLink
                      to="/suggestions"
                      className={navLinkClass}
                      onClick={() => setOpen(false)}
                    >
                      Suggestions
                    </NavLink>
                    <NavLink
                      to="/external-links"
                      className={navLinkClass}
                      onClick={() => setOpen(false)}
                    >
                      External Links
                    </NavLink>
                    <NavLink
                      to="/body-details"
                      className={navLinkClass}
                      onClick={() => setOpen(false)}
                    >
                      Association Body
                    </NavLink>
                    <NavLink
                      to="/donations"
                      className={navLinkClass}
                      onClick={() => setOpen(false)}
                    >
                      Donations
                    </NavLink>
                  </div>
                </div>

                {user && (
                  <div className="pt-4 pb-2 border-t border-gray-200">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Account
                    </div>
                    <div className="space-y-1">
                      {user.role === "admin" && (
                        <NavLink
                          to="/admin"
                          className={navLinkClass}
                          onClick={() => setOpen(false)}
                        >
                          Admin Panel
                        </NavLink>
                      )}
                      {user.role === "admin" && (
                        <NavLink
                          to="/forum-moderation"
                          className={(props) =>
                            `${navLinkClass(
                              props
                            )} flex items-center justify-between`
                          }
                          onClick={() => setOpen(false)}
                        >
                          <span>Forum Moderation</span>
                          {pendingCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                              {pendingCount}
                            </span>
                          )}
                        </NavLink>
                      )}
                      <NavLink
                        to="/profile"
                        className={navLinkClass}
                        onClick={() => setOpen(false)}
                      >
                        My Profile
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg mt-3 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}

                {!user && (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      to="/login"
                      className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[var(--accent)] to-yellow-500 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                      onClick={() => setOpen(false)}
                    >
                      Login / Register
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
