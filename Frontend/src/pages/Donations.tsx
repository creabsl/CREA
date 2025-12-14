import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePageTitle } from '../hooks/usePageTitle'
import Input from '../components/Input'
import Button from '../components/Button'

export default function Donations() {
  usePageTitle('CREA • Support Our Mission')
  
  const [formData, setFormData] = useState({
    // Donor Information
    fullName: '',
    email: '',
    mobile: '',
    
    // Optional - If they are from the organization
    isEmployee: false,
    employeeId: '',
    designation: '',
    division: '',
    department: '',
    
    // Donation Details
    amount: '',
    purpose: 'general', // general, education, welfare, infrastructure
    isAnonymous: false,
    
    // Address (optional)
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Message (optional)
    message: ''
  })

  const [showEmployeeFields, setShowEmployeeFields] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:5001/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSubmitted(true)
        
        // Reset form after showing success message
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            mobile: '',
            isEmployee: false,
            employeeId: '',
            designation: '',
            division: '',
            department: '',
            amount: '',
            purpose: 'general',
            isAnonymous: false,
            address: '',
            city: '',
            state: '',
            pincode: '',
            message: ''
          })
          setShowEmployeeFields(false)
          setSubmitted(false)
        }, 5000)
      } else {
        console.error('Donation submission failed:', data.message)
        alert('Failed to submit donation. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting donation:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const isFormValid = () => {
    const basicValid = formData.fullName.trim() && 
                      formData.email.trim() && 
                      formData.mobile.trim() &&
                      formData.amount.trim() &&
                      parseFloat(formData.amount) > 0
    
    if (showEmployeeFields) {
      return basicValid && formData.employeeId.trim() && formData.designation.trim()
    }
    
    return basicValid
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">Thank You for Your Generosity!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Your contribution of <span className="font-bold text-[var(--accent)]">₹{formData.amount}</span> will make a significant difference in supporting our mission.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Payment gateway integration is currently being set up. You will receive confirmation details via email once the payment is processed.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Your support strengthens our railway engineering community</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] rounded-2xl p-8 md:p-12 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold !text-white mb-2">Support Our Mission</h1>
              <p className="text-white/90 text-lg">Your contribution helps us build a stronger railway engineering community</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">Education & Training</h3>
          <p className="text-gray-600 text-sm">Supporting professional development programs and workshops</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Member Welfare</h3>
          <p className="text-gray-600 text-sm">Providing support and assistance to members in need</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[var(--accent)] mb-2">Infrastructure</h3>
          <p className="text-gray-600 text-sm">Building and maintaining community facilities and resources</p>
        </motion.div>
      </div>

      {/* Main Donation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
          <span className="text-2xl">₹</span>
          Make a Donation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donor Information */}
          <div>
            <div className="border-l-4 border-[var(--primary)] pl-4 mb-4">
              <h3 className="text-lg font-bold text-[var(--primary)]">Donor Information</h3>
              <p className="text-sm text-gray-600">Please provide your contact details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
                placeholder="Enter your full name"
              />
              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="your.email@example.com"
              />
              <Input
                label="Mobile Number *"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                required
                pattern="[6-9][0-9]{9}"
                placeholder="10-digit mobile number"
              />
              
              {/* Employee Checkbox */}
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEmployeeFields}
                    onChange={(e) => {
                      setShowEmployeeFields(e.target.checked)
                      handleInputChange('isEmployee', e.target.checked)
                    }}
                    className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
                  />
                  <span className="text-sm font-medium text-gray-700">I am a Railway Employee/Member</span>
                </label>
              </div>
            </div>

            {/* Employee-specific fields */}
            {showEmployeeFields && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <Input
                  label="Employee/Member ID *"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  placeholder="Your employee/member ID"
                />
                <Input
                  label="Designation *"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Your designation"
                />
                <Input
                  label="Division"
                  value={formData.division}
                  onChange={(e) => handleInputChange('division', e.target.value)}
                  placeholder="Your division"
                />
                <Input
                  label="Department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Your department"
                />
              </motion.div>
            )}
          </div>

          {/* Donation Details */}
          <div>
            <div className="border-l-4 border-green-600 pl-4 mb-4">
              <h3 className="text-lg font-bold text-green-700">Donation Details</h3>
              <p className="text-sm text-gray-600">Choose your contribution amount and purpose</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Donation Amount (₹) *"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                  min="1"
                  placeholder="Enter amount"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {[100, 500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleInputChange('amount', amt.toString())}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 hover:bg-[var(--primary)] hover:text-white rounded-lg transition-colors"
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Donation Purpose</label>
                <select
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-[var(--primary)]"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                >
                  <option value="general">General Fund</option>
                  <option value="education">Education & Training Programs</option>
                  <option value="welfare">Member Welfare & Support</option>
                  <option value="infrastructure">Infrastructure Development</option>
                </select>
              </div>

              {/* Anonymous Donation */}
              <div className="md:col-span-2 flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                    className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
                  />
                  <span className="text-sm font-medium text-gray-700">Make this donation anonymous</span>
                </label>
              </div>
            </div>
          </div>

          {/* Optional Address */}
          <div>
            <div className="border-l-4 border-gray-400 pl-4 mb-4">
              <h3 className="text-lg font-bold text-gray-700">Address (Optional)</h3>
              <p className="text-sm text-gray-600">For donation receipt and tax purposes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State"
              />
              <Input
                label="PIN Code"
                type="tel"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="6-digit PIN code"
                pattern="[0-9]{6}"
                maxLength={6}
              />
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Share why you're supporting us or leave a message for the community..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-xs text-gray-500 max-w-md">
              By proceeding, you agree to make a contribution to support CREA's mission and activities.
            </p>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="px-8 py-3 text-base"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Proceed to Donate
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Why Donate Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why Your Support Matters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Empowering Engineers</h4>
              <p className="text-sm text-gray-600">Supporting continuous learning and professional development for railway engineers across all divisions.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Community Building</h4>
              <p className="text-sm text-gray-600">Fostering a strong network of professionals dedicated to excellence in railway engineering.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Knowledge Sharing</h4>
              <p className="text-sm text-gray-600">Creating platforms for sharing expertise, best practices, and innovative solutions.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Member Welfare</h4>
              <p className="text-sm text-gray-600">Providing assistance and support to members during times of need and emergencies.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
