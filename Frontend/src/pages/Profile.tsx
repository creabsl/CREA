import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/auth'
import { usePageTitle } from '../hooks/usePageTitle'
import { updateProfile, getProfile } from '../services/api'
import Input from '../components/Input'
import Button from '../components/Button'
import type { User } from '../services/api'

export default function Profile(){
  const { user: contextUser } = useAuth()
  usePageTitle('CREA • Profile')
  
  const [user, setUser] = useState<User | null>(contextUser)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
    division: user?.division || '',
    department: user?.department || '',
    mobile: user?.mobile || ''
  })

  // Fetch profile data from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true)
        setError('') // Clear any previous errors
        const profileData = await getProfile()
        setUser(profileData)
        setFormData({
          name: profileData.name || '',
          designation: profileData.designation || '',
          division: profileData.division || '',
          department: profileData.department || '',
          mobile: profileData.mobile || ''
        })
        // Update localStorage with fresh data
        localStorage.setItem('crea:user', JSON.stringify(profileData))
      } catch (err) {
        console.error('Failed to fetch profile:', err)
        // If we have cached user data, use it instead of showing error
        if (contextUser) {
          setUser(contextUser)
          setFormData({
            name: contextUser.name || '',
            designation: contextUser.designation || '',
            division: contextUser.division || '',
            department: contextUser.department || '',
            mobile: contextUser.mobile || ''
          })
          // Don't show error if we have cached data
        } else {
          setError('Failed to load profile data. Please try logging in again.')
        }
      } finally {
        setLoadingProfile(false)
      }
    }
    
    if (contextUser) {
      fetchProfile()
    }
  }, [])

  // Sync formData with user data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        designation: user.designation || '',
        division: user.division || '',
        department: user.department || '',
        mobile: user.mobile || ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    
    try {
      const updatedUser = await updateProfile(formData)
      // Update both local state and localStorage
      setUser(updatedUser)
      localStorage.setItem('crea:user', JSON.stringify(updatedUser))
      setMessage('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      designation: user?.designation || '',
      division: user?.division || '',
      department: user?.department || '',
      mobile: user?.mobile || ''
    })
    setIsEditing(false)
    setError('')
    setMessage('')
  }

  if (loadingProfile) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-[var(--primary)]">My Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </Button>
        )}
      </motion.div>

      {/* Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {message}
        </motion.div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
      >
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold !text-white">{user?.name}</h2>
              <p className="text-sm text-white/90">{user?.email}</p>
              <span className="inline-block mt-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                {user?.role === 'admin' ? 'Administrator' : 'Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Enter your mobile number"
                    type="tel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g., Assistant Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Division</label>
                  <Input
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    placeholder="e.g., Mumbai Division"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Mechanical"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</div>
                <div className="text-base font-medium text-gray-900">{user?.name || '-'}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</div>
                <div className="text-base font-medium text-gray-900">{user?.email || '-'}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile Number</div>
                <div className="text-base font-medium text-gray-900">{user?.mobile || 'Not provided'}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Designation</div>
                <div className="text-base font-medium text-gray-900">{user?.designation || 'Not provided'}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Division</div>
                <div className="text-base font-medium text-gray-900">{user?.division || 'Not provided'}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</div>
                <div className="text-base font-medium text-gray-900">{user?.department || 'Not provided'}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Membership Type</div>
                <div className="text-base font-medium text-gray-900">{user?.membershipType || 'None'}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</div>
                <div className="text-base font-medium text-gray-900 capitalize">{user?.role || 'member'}</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
