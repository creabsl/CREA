import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import AuthProvider from './context/AuthContext'
import { AdvertisementProvider } from './context/AdvertisementContext'
import { RequireAuth, RequireRole } from './routes/guards'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Forum from './pages/Forum'
import Documents from './pages/Documents'
import Membership from './pages/Membership'
import ExternalLinks from './pages/ExternalLinks'
import BodyDetails from './pages/BodyDetails'
import Suggestions from './pages/Suggestions'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import MutualTransfers from './pages/MutualTransfers'
import About from './pages/About'
import ForumModeration from './pages/ForumModeration'
import Notifications from './pages/Notifications'
import Donations from './pages/Donations'
import Developers from './pages/Developers'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/admin" element={<RequireRole role="admin"><PageTransition><Admin /></PageTransition></RequireRole>} />
        <Route path="/forum-moderation" element={<RequireRole role="admin"><PageTransition><ForumModeration /></PageTransition></RequireRole>} />
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/events" element={<RequireAuth><PageTransition><Events /></PageTransition></RequireAuth>} />
        <Route path="/forum" element={<RequireAuth><PageTransition><Forum /></PageTransition></RequireAuth>} />
        <Route path="/documents" element={<RequireAuth><PageTransition><Documents /></PageTransition></RequireAuth>} />
        <Route path="/apply-membership" element={<RequireAuth><PageTransition><Membership /></PageTransition></RequireAuth>} />
        <Route path="/body-details" element={<RequireAuth><PageTransition><BodyDetails /></PageTransition></RequireAuth>} />
        <Route path="/suggestions" element={<RequireAuth><PageTransition><Suggestions /></PageTransition></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><PageTransition><Profile /></PageTransition></RequireAuth>} />
        <Route path="/mutual-transfers" element={<RequireAuth><PageTransition><MutualTransfers /></PageTransition></RequireAuth>} />
        <Route path="/external-links" element={<RequireAuth><PageTransition><ExternalLinks /></PageTransition></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><PageTransition><Notifications /></PageTransition></RequireAuth>} />
        <Route path="/donations" element={<PageTransition><Donations /></PageTransition>} />
        <Route path="/developers" element={<PageTransition><Developers /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdvertisementProvider>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </AdvertisementProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
