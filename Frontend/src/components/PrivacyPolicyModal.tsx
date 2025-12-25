import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={handleBackdropClick}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8"
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[var(--primary)] to-[#19417d] px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Privacy Policy
                  </h2>
                  <p className="text-sm text-white/80 mt-1">Central Railway Engineers Association (CREA)</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
              <div className="px-6 py-6">
                <div className="prose prose-sm max-w-none">
                {/* Meta Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <span className="font-semibold text-gray-700">Last Updated:</span>
                      <span className="text-gray-600 ml-2">December 18, 2025</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Effective Date:</span>
                      <span className="text-gray-600 ml-2">January 1, 2026</span>
                    </div>
                  </div>
                </div>

                {/* Introduction */}
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                    <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    Introduction
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Central Railway Engineers Association (CREA) respects your privacy and is committed to protecting the personal information of visitors and members using this website and our payment systems. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (including any associated applications), interact with us, and use our services including online donations and membership payments.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services.
                  </p>
                </section>

                {/* Information We Collect */}
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                    <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    Information We Collect
                  </h3>
                  
                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">2.1 Personal Information You Provide</h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We may collect the following personal information when you create a membership account, make a donation, register for events, subscribe to newsletters, contact us for support, or participate in forums or discussions.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">Types of Personal Information:</p>
                    <ul className="space-y-1 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)] mt-1">•</span>
                        <span><strong>Name:</strong> Full legal name or preferred name</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)] mt-1">•</span>
                        <span><strong>Contact Information:</strong> Email address, phone number, postal address</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)] mt-1">•</span>
                        <span><strong>Membership Details:</strong> Designation, division, department, unit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)] mt-1">•</span>
                        <span><strong>Professional Information:</strong> Organization, role, experience level</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)] mt-1">•</span>
                        <span><strong>Payment Information:</strong> Transaction references only (we do NOT store card/bank/UPI details)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--accent)] mt-1">•</span>
                        <span><strong>Account Credentials:</strong> Username, password (hashed and encrypted)</span>
                      </li>
                    </ul>
                  </div>

                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">2.2 Automatically Collected Information</h4>
                  <p className="text-gray-700 leading-relaxed">
                    When you visit our website, we automatically collect technical data such as IP address, browser type, operating system, pages visited, time/date of access, device information, cookies and similar technologies, and analytics data.
                  </p>

                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">2.3 No Automatic Collection of Sensitive Data</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-semibold text-red-800 mb-2">We DO NOT collect or store:</p>
                    <ul className="space-y-1 text-red-700 text-sm">
                      <li>❌ Credit card details</li>
                      <li>❌ Bank account information</li>
                      <li>❌ UPI IDs (except for reconciliation purposes)</li>
                      <li>❌ Sensitive personal information (SSN, government ID numbers)</li>
                      <li>❌ Biometric data</li>
                      <li>❌ Health or genetic information</li>
                    </ul>
                  </div>
                </section>

                {/* How We Use Your Information */}
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                    <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    How We Use Your Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Membership Management
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Creating and managing accounts</li>
                        <li>• Processing applications</li>
                        <li>• Setting validity periods</li>
                        <li>• Sending communications</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Processing
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Processing donations & fees</li>
                        <li>• Creating receipts</li>
                        <li>• Recording transactions</li>
                        <li>• Preventing fraud</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Communication
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Transactional emails</li>
                        <li>• Newsletters & updates</li>
                        <li>• Support responses</li>
                        <li>• Event notifications</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Website Improvement
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Analyzing usage</li>
                        <li>• Identifying issues</li>
                        <li>• Improving UX</li>
                        <li>• Testing features</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Data Security */}
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                    <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    Data Security
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-3">We implement comprehensive security measures:</p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">🔒</span>
                        <span className="text-gray-700">SSL/TLS encryption for all data in transit</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">🔒</span>
                        <span className="text-gray-700">Password hashing with industry standards</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">🔒</span>
                        <span className="text-gray-700">Regular security audits</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">🔒</span>
                        <span className="text-gray-700">Firewall & intrusion detection</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">🔒</span>
                        <span className="text-gray-700">Database encryption at rest</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">🔒</span>
                        <span className="text-gray-700">JWT tokens with expiry</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-700">
                      ⚠️ <strong>Important Notice:</strong> No internet transmission is completely secure. While we implement robust security measures, we cannot guarantee absolute security of your information.
                    </p>
                  </div>
                </section>

                {/* Your Rights */}
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                    <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    Your Rights and Choices
                  </h3>
                  <p className="text-gray-700 mb-3">You have the right to:</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {[
                      { icon: '👁️', title: 'Access', desc: 'Request a copy of your data' },
                      { icon: '✏️', title: 'Correction', desc: 'Update inaccurate information' },
                      { icon: '🗑️', title: 'Deletion', desc: 'Request data deletion' },
                      { icon: '📦', title: 'Portability', desc: 'Get data in portable format' },
                      { icon: '🚫', title: 'Objection', desc: 'Object to processing' },
                      { icon: '⏸️', title: 'Restriction', desc: 'Limit data processing' },
                    ].map((right, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                        <span className="text-2xl">{right.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{right.title}</p>
                          <p className="text-xs text-gray-600">{right.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-800 mb-2">To exercise your rights:</p>
                    <p className="text-sm text-gray-700">
                      Email us at: <a href="mailto:creabsl@gmail.com" className="text-[var(--primary)] hover:underline font-semibold">creabsl@gmail.com</a> or call{' '}
                      <a href="tel:+919503011162" className="text-[var(--primary)] hover:underline font-semibold">9503011162</a>
                    </p>
                    <p className="text-xs text-gray-600 mt-2">We will respond within 30 days.</p>
                  </div>
                </section>

                {/* Data Retention */}
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                    <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">8</span>
                    Data Retention
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Data Type</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-700">Retention Period</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2 text-gray-700">Active membership records</td>
                          <td className="px-4 py-2 text-gray-700">Duration + 1 year</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700">Inactive membership records</td>
                          <td className="px-4 py-2 text-gray-700">3 years</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700">Payment records</td>
                          <td className="px-4 py-2 text-gray-700">5-7 years</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700">Communication records</td>
                          <td className="px-4 py-2 text-gray-700">2 years</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700">Analytics data</td>
                          <td className="px-4 py-2 text-gray-700">26 months</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Cookies */}
                <section className="mb-8">
                  <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                    <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
                    Cookies and Tracking
                  </h3>
                  <p className="text-gray-700 mb-3">We use cookies for:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--accent)] font-bold mt-1">•</span>
                      <span><strong>Essential Cookies:</strong> Session tokens, CSRF protection, preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--accent)] font-bold mt-1">•</span>
                      <span><strong>Analytics Cookies:</strong> Google Analytics, performance monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--accent)] font-bold mt-1">•</span>
                      <span><strong>Security Cookies:</strong> Authentication, fraud detection</span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    You can control cookies through your browser settings. Note that disabling essential cookies may prevent website functionality.
                  </p>
                </section>

                {/* Contact Information */}
                <section className="mb-6">
                  <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                    <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">16</span>
                    Contact Us
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                    <p className="font-semibold text-gray-800 mb-3">For privacy-related questions:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">
                          <strong>Email:</strong> <a href="mailto:creabsl@gmail.com" className="text-[var(--primary)] hover:underline">creabsl@gmail.com</a>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700">
                          <strong>Phone:</strong> <a href="tel:+919503011162" className="text-[var(--primary)] hover:underline">9503011162</a>
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                      We aim to respond within 5-30 business days depending on request complexity.
                    </p>
                  </div>
                </section>

                {/* Acknowledgment */}
                <section className="mb-6">
                  <div className="bg-gray-100 border-l-4 border-[var(--primary)] rounded-r-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Acknowledgment</h4>
                    <p className="text-sm text-gray-700">
                      By using CREA's website and services, you acknowledge that you have read and understood this Privacy Policy, consent to our privacy practices, and accept the data processing described herein.
                    </p>
                  </div>
                </section>

                {/* Version Info */}
                <div className="border-t border-gray-200 pt-4 mt-6 text-xs text-gray-500 space-y-1">
                  <p><strong>Policy Version:</strong> 1.0</p>
                  <p><strong>Last Updated:</strong> December 18, 2025</p>
                  <p><strong>Review Schedule:</strong> Annual or upon regulatory changes</p>
                </div>
              </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
