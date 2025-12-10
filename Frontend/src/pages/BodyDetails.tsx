import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getBodyMembers } from '../services/api'
import type { BodyMember, Division } from '../types'
import { DIVISIONS } from '../types'
import { usePageTitle } from '../hooks/usePageTitle'
import SegmentedControl from '../components/SegmentedControl'

// Demo data - will be replaced with actual API data if available
const demoMembers: BodyMember[] = [
  {
    id: '1',
    name: 'A. Sharma',
    designation: 'President',
    photoUrl: 'https://ui-avatars.com/api/?name=A+Sharma&size=200&background=0d2c54&color=fff&bold=true',
    division: 'Mumbai'
  },
  {
    id: '2',
    name: 'R. Gupta',
    designation: 'General Secretary',
    photoUrl: 'https://ui-avatars.com/api/?name=R+Gupta&size=200&background=f2a900&color=fff&bold=true',
    division: 'Mumbai'
  },
  {
    id: '3',
    name: 'S. Khan',
    designation: 'Treasurer',
    photoUrl: 'https://ui-avatars.com/api/?name=S+Khan&size=200&background=708090&color=fff&bold=true',
    division: 'Mumbai'
  },
  {
    id: '4',
    name: 'P. Verma',
    designation: 'Joint Secretary',
    photoUrl: 'https://ui-avatars.com/api/?name=P+Verma&size=200&background=0d2c54&color=fff&bold=true',
    division: 'Pune'
  },
  {
    id: '5',
    name: 'M. Singh',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=M+Singh&size=200&background=f2a900&color=fff&bold=true',
    division: 'Pune'
  },
  {
    id: '6',
    name: 'K. Patel',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=K+Patel&size=200&background=708090&color=fff&bold=true',
    division: 'Nagpur'
  },
  {
    id: '7',
    name: 'N. Reddy',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=N+Reddy&size=200&background=0d2c54&color=fff&bold=true',
    division: 'Nagpur'
  },
  {
    id: '8',
    name: 'D. Kumar',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=D+Kumar&size=200&background=f2a900&color=fff&bold=true',
    division: 'Solapur'
  },
  {
    id: '9',
    name: 'V. Mehta',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=V+Mehta&size=200&background=708090&color=fff&bold=true',
    division: 'Solapur'
  },
  {
    id: '10',
    name: 'T. Desai',
    designation: 'Executive Member',
    photoUrl: 'https://ui-avatars.com/api/?name=T+Desai&size=200&background=0d2c54&color=fff&bold=true',
    division: 'BSL'
  }
];

export default function BodyDetails() {
  const [list, setList] = useState<BodyMember[]>(demoMembers)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDivision, setSelectedDivision] = useState<Division>('BSL')
  
  usePageTitle('CREA • Association Body')
  
  useEffect(() => {
    setIsLoading(true)
    getBodyMembers(selectedDivision)
      .then(data => {
        // Always use API data from database
        setList(data)
      })
      .catch((error) => {
        console.error('Failed to fetch body members:', error)
        // On error, use demo data filtered by division
        setList(demoMembers.filter(m => m.division === selectedDivision))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [selectedDivision])

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

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Header with Enhanced Gradient & Pattern */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d2c54] via-[#19417d] to-[#1a4d8f] p-12 md:p-16 text-white shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 mb-4"
              >
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm ring-4 ring-white/10">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold !text-white tracking-tight" style={{ color: 'white' }}>Association Body</h1>
                  <p className="text-white/80 text-sm md:text-base mt-1 font-medium">Leadership & Executive Committee</p>
                </div>
              </motion.div>
              <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">
                Meet the dedicated office bearers leading the Central Railway Engineers Association across all divisions
              </p>
            </div>
            
            {/* Stats Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 text-center border border-white/20">
                <div className="text-3xl font-bold text-white">{list.length}</div>
                <div className="text-white/70 text-sm font-medium mt-1">Members</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 text-center border border-white/20">
                <div className="text-3xl font-bold text-[var(--accent)]">5</div>
                <div className="text-white/70 text-sm font-medium mt-1">Divisions</div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Decorative elements */}
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-gradient-to-br from-[var(--accent)]/20 to-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-10 left-1/3 w-3 h-3 bg-[var(--accent)]/40 rounded-full animate-pulse"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{ 
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </motion.div>

      {/* Division Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex justify-center"
      >
        <SegmentedControl
          options={DIVISIONS.map(d => ({ label: d, value: d }))}
          value={selectedDivision}
          onChange={(v) => setSelectedDivision(v as Division)}
        />
      </motion.div>

      {/* All Members Section */}
      {list.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Members Found</h3>
          <p className="text-gray-500">There are no body members for {selectedDivision} division yet.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Section Title */}
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-[var(--primary)] mb-2"
            >
              {selectedDivision} Division
            </motion.h2>
            <p className="text-gray-600">Office Bearers & Executive Committee</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {list.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                  {/* Photo */}
                  <div className="mb-4">
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-[var(--primary)]/10 shadow-lg group-hover:border-[var(--primary)]/30 transition-all duration-300"
                    />
                  </div>

                  {/* Name */}
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {member.name}
                  </h4>
                  
                  {/* Designation */}
                  <p className="text-sm font-medium text-[var(--primary)]">
                    {member.designation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}


    </div>
  )
}
