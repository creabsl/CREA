import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TermsOfServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Terms of Service
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

                  {/* Agreement Overview */}
                  <section className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                      Agreement Overview
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "Member," or "You") and Central Railway Engineers Association ("CREA," "We," "Us," or "Our"). By accessing or using our website, mobile applications, payment systems, or services, you agree to be bound by these Terms.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <p className="text-sm text-red-800 font-semibold">
                        If you do not agree with these Terms, please do not use our services.
                      </p>
                    </div>
                  </section>

                  {/* Use of Services */}
                  <section className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                      Use of Services
                    </h3>
                    
                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">3.1 Eligibility Requirements</h4>
                    <p className="text-gray-700 mb-3">To use CREA's services, you must:</p>
                    <div className="bg-green-50 rounded-lg p-4">
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✅</span>
                          <span>Be at least 18 years old (or have parental consent if younger)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✅</span>
                          <span>Be a natural person (not a bot or automated system)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✅</span>
                          <span>Have the legal capacity to enter into binding agreements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✅</span>
                          <span>Not be prohibited by law from using our services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✅</span>
                          <span>Comply with all applicable laws and regulations</span>
                        </li>
                      </ul>
                    </div>

                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">3.3 Prohibited Uses</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="font-semibold text-red-800 mb-2">You may NOT use our services for:</p>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Illegal Activities:</p>
                          <ul className="space-y-1 text-red-700">
                            <li>❌ Money laundering or fraud</li>
                            <li>❌ Copyright infringement</li>
                            <li>❌ Violation of any law</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Harmful Activities:</p>
                          <ul className="space-y-1 text-red-700">
                            <li>❌ Hacking or unauthorized access</li>
                            <li>❌ Malware or viruses</li>
                            <li>❌ Harassment or abuse</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Membership Terms */}
                  <section className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                      Membership Terms
                    </h3>
                    
                    <h4 className="font-semibold text-gray-800 mb-3">4.1 Membership Types</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Ordinary Membership
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Duration: 1 year</li>
                          <li>• Renewal: Annual</li>
                          <li>• Benefits: Full access</li>
                        </ul>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Lifetime Membership
                        </h5>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Duration: Lifetime</li>
                          <li>• Renewal: Not required</li>
                          <li>• Benefits: Full access</li>
                        </ul>
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-800 mt-4 mb-2">4.6 Refund Policy</h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="font-semibold text-red-800 mb-2">No Refunds For:</p>
                        <ul className="space-y-1 text-red-700">
                          <li>❌ Membership fees (unused duration)</li>
                          <li>❌ Voluntary cancellation</li>
                          <li>❌ Change of mind</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="font-semibold text-green-800 mb-2">Refunds Issued For:</p>
                        <ul className="space-y-1 text-green-700">
                          <li>✅ Duplicate payments (7 days)</li>
                          <li>✅ Fraudulent transactions (30 days)</li>
                          <li>✅ Technical errors</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Payments */}
                  <section className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                      Donations and Payments
                    </h3>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Payment Security
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• All payments processed through Razorpay (PCI-DSS certified)</li>
                        <li>• HTTPS encryption for all transactions</li>
                        <li>• Card/bank/UPI details NOT stored by CREA</li>
                        <li>• HMAC SHA256 signature verification for fraud prevention</li>
                      </ul>
                    </div>
                  </section>

                  {/* Intellectual Property */}
                  <section className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                      Intellectual Property Rights
                    </h3>
                    <p className="text-gray-700 mb-3">
                      All content on our website, including text, images, videos, code, and designs, are the exclusive property of CREA and protected by copyright, trademark, and trade secret laws.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="font-semibold text-green-800 mb-2">You MAY:</p>
                        <ul className="space-y-1 text-green-700">
                          <li>✅ View content for personal use</li>
                          <li>✅ Download for non-commercial use</li>
                          <li>✅ Access membership resources</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="font-semibold text-red-800 mb-2">You may NOT:</p>
                        <ul className="space-y-1 text-red-700">
                          <li>❌ Reproduce or distribute</li>
                          <li>❌ Create derivative works</li>
                          <li>❌ Use for commercial purposes</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Liability */}
                  <section className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">8</span>
                      Liability and Limitations
                    </h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Disclaimer of Warranties</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>OUR SERVICES ARE PROVIDED "AS-IS" AND "AS AVAILABLE"</strong>
                      </p>
                      <p className="text-xs text-gray-600">
                        We disclaim all warranties including merchantability, fitness for a particular purpose, accuracy of information, or uninterrupted service.
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-3">
                      <h4 className="font-semibold text-red-800 mb-2">Limitation of Liability</h4>
                      <p className="text-sm text-gray-700">
                        <strong>Maximum Liability:</strong> Limited to the amount you paid to CREA in the past 12 months
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        CREA is not liable for lost profits, loss of data, business interruption, or any indirect, incidental, or consequential damages.
                      </p>
                    </div>
                  </section>

                  {/* Dispute Resolution */}
                  <section className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">14</span>
                      Dispute Resolution
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Step 1: Informal Resolution</h4>
                        <p className="text-xs text-gray-700">
                          Contact CREA at creabsl@gmail.com and allow 30 days to respond and discuss resolution in good faith.
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Step 2: Mediation</h4>
                        <p className="text-xs text-gray-700">
                          If informal resolution fails, either party may request mediation with a neutral third-party mediator.
                        </p>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Jurisdiction</h4>
                        <p className="text-xs text-gray-700">
                          <strong>Applicable Law:</strong> Laws of India<br />
                          <strong>Exclusive Venue:</strong> Courts of India
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Termination */}
                  <section className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">10</span>
                      Termination of Services
                    </h3>
                    <p className="text-gray-700 mb-3">
                      CREA may terminate or suspend your account for breach of Terms, illegal activity, abuse of services, non-payment, or inactivity.
                    </p>
                    <div className="bg-gray-100 border-l-4 border-gray-400 rounded-r-lg p-3">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">Effect of Termination:</h4>
                      <ul className="space-y-1 text-xs text-gray-700">
                        <li>• Your access to services immediately ceases</li>
                        <li>• Your membership benefits end</li>
                        <li>• Data retention per Privacy Policy</li>
                        <li>• No refunds issued (except as required by law)</li>
                      </ul>
                    </div>
                  </section>

                  {/* Contact Information */}
                  <section className="mb-6">
                    <h3 className="text-lg font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
                      <span className="bg-[var(--primary)] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">16</span>
                      Contact and Support
                    </h3>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                      <p className="font-semibold text-gray-800 mb-3">For questions or support:</p>
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
                            <strong>Phone:</strong> <a href="tel:+919503011162" className="text-[var(--primary)] hover:underline">+91 9503011162</a>
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-3">
                        Response time: 5 business days for standard requests
                      </p>
                    </div>
                  </section>

                  {/* Acknowledgment */}
                  <section className="mb-6">
                    <div className="bg-gray-100 border-l-4 border-[var(--primary)] rounded-r-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Acknowledgment</h4>
                      <p className="text-sm text-gray-700">
                        By using CREA's website and services, you acknowledge that you have read these Terms in full, understand and accept all provisions, are legally bound by these Terms, and will comply with all applicable laws.
                      </p>
                    </div>
                  </section>

                  {/* Version Info */}
                  <div className="border-t border-gray-200 pt-4 mt-6 text-xs text-gray-500 space-y-1">
                    <p><strong>Document Version:</strong> 1.0</p>
                    <p><strong>Last Updated:</strong> December 18, 2025</p>
                    <p><strong>Effective Date:</strong> January 1, 2026</p>
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
