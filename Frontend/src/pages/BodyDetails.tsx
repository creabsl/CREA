import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getBodyMembers } from '../services/api'
import type { BodyMember } from '../types'
import { usePageTitle } from '../hooks/usePageTitle'

// Demo data - will be replaced with actual API data if available
const demoMembers: BodyMember[] = [
  {
    id: '1',
    name: 'A. Sharma',
    designation: 'President',
    photoUrl: 'https://ui-avatars.com/api/?name=A+Sharma&size=200&background=0d2c54&color=fff&bold=true'
  },
  {
    id: '2',
    name: 'R. Gupta',
    designation: 'General Secretary',
    photoUrl: 'https://ui-avatars.com/api/?name=R+Gupta&size=200&background=f2a900&color=fff&bold=true'
  },
  {
    id: '3',
    name: 'S. Khan',
    designation: 'Treasurer',
    photoUrl: 'https://ui-avatars.com/api/?name=S+Khan&size=200&background=708090&color=fff&bold=true'
  },
  {
    id: '4',
    name: 'P. Verma',
    designation: 'Joint Secretary',
    photoUrl: 'https://ui-avatars.com/api/?name=P+Verma&size=200&background=0d2c54&color=fff&bold=true'
  },
  {
    id: '5',
    name: 'M. Singh',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=M+Singh&size=200&background=f2a900&color=fff&bold=true'
  },
  {
    id: '6',
    name: 'K. Patel',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=K+Patel&size=200&background=708090&color=fff&bold=true'
  },
  {
    id: '7',
    name: 'N. Reddy',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=N+Reddy&size=200&background=0d2c54&color=fff&bold=true'
  },
  {
    id: '8',
    name: 'D. Kumar',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=D+Kumar&size=200&background=f2a900&color=fff&bold=true'
  },
  {
    id: '9',
    name: 'V. Mehta',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=V+Mehta&size=200&background=708090&color=fff&bold=true'
  },
  {
    id: '10',
    name: 'T. Desai',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=T+Desai&size=200&background=0d2c54&color=fff&bold=true'
  }
];

export default function BodyDetails() {
  const [list, setList] = useState<BodyMember[]>(demoMembers)
  const [isLoading, setIsLoading] = useState(true)
  
  usePageTitle('CREA • Association Body')
  
  useEffect(() => {
    setIsLoading(true)
    getBodyMembers()
      .then(data => {
        // Use API data if available, otherwise use demo data
        if (data && data.length > 0) {
          setList(data)
        }
      })
      .catch(() => {
        // On error, use demo data
        setList(demoMembers)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--primary)] border-r-transparent"></div>
          <p className="mt-4 text-[var(--secondary)]">Loading association body...</p>
        </div>
      </div>
    );
  }

  // Separate members by designation for better organization
  const leadership = list.filter(m => 
    m.designation.toLowerCase().includes('president') || 
    m.designation.toLowerCase().includes('secretary') || 
    m.designation.toLowerCase().includes('treasurer')
  );
  const executives = list.filter(m => 
    m.designation.toLowerCase().includes('executive') ||
    m.designation.toLowerCase().includes('joint')
  );

  return (
    <div className="space-y-8">
      {/* Hero Header with Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] p-8 text-white shadow-xl"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold !text-white" style={{ color: 'white' }}>Association Body</h1>
          </div>
          <p className="text-white/90 text-lg">Meet the office bearers of CREA</p>
        </div>
        
        {/* Decorative blob */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Leadership Section */}
      {leadership.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadership.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="group relative rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Decorative accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] rounded-t-2xl"></div>
                
                {/* Photo with ring */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] rounded-full blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <img 
                    src={member.photoUrl} 
                    alt={member.name} 
                    className="relative mx-auto h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {/* Status indicator */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Name and designation */}
                <h4 className="text-xl font-bold text-[var(--primary)] mb-1">{member.name}</h4>
                <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent)]/20 text-[var(--accent)] text-sm font-semibold mb-4">
                  {member.designation}
                </div>

                {/* Contact icons */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                    title="Email"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                    title="Phone"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Executive Members Section */}
      {executives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {executives.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group rounded-xl border border-gray-200 bg-white p-6 text-center shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative inline-block mb-3">
                  <img 
                    src={member.photoUrl} 
                    alt={member.name} 
                    className="mx-auto h-24 w-24 rounded-full object-cover border-3 border-[var(--accent)]/20 group-hover:border-[var(--accent)] transition-all shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--accent)] rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Name and designation */}
                <h4 className="font-bold text-[var(--primary)] mb-1">{member.name}</h4>
                <p className="text-xs text-[var(--secondary)]">{member.designation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
