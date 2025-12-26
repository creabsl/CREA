import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getBodyMembers } from '../services/api'
import type { BodyMember, Division } from '../types'
import { DIVISIONS } from '../types'
import { usePageTitle } from '../hooks/usePageTitle'
import SegmentedControl from '../components/SegmentedControl'

// Demo data
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
    division: 'Bhusawal'
  }
];

export default function BodyDetails() {
  const [list, setList] = useState<BodyMember[]>(demoMembers)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDivision, setSelectedDivision] = useState<Division>('Bhusawal')
  
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
    <div className="space-y-4 sm:space-y-6">
      {/* Responsive Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-[var(--primary)] truncate">Association Body</h1>
              <p className="text-[10px] sm:text-xs text-gray-600 truncate">Executive Committee Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Division Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-5">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-sm sm:text-base font-semibold text-[var(--primary)]">Select Division</h2>
        </div>
        <SegmentedControl
          options={DIVISIONS.map(d => ({ label: d, value: d }))}
          value={selectedDivision}
          onChange={(v) => setSelectedDivision(v as Division)}
        />
      </div>

      {/* Members Grid */}
      {list.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="inline-block p-3 bg-gray-100 rounded-lg mb-3">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">No Members Found</h3>
          <p className="text-sm text-gray-500">No body members for {selectedDivision} division yet.</p>
        </div>
      ) : (
        <motion.div>
          {/* Responsive Section Title */}
          <div className="text-center mb-6 sm:mb-8 px-3">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-bold text-[var(--primary)] mb-1 sm:mb-2"
            >
              {selectedDivision} Division
            </motion.h2>
            <p className="text-xs sm:text-sm text-gray-600">Office Bearers & Executive Committee</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-3 sm:px-0">
            {list.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                  {/* Photo */}
                  <div className="mb-3 sm:mb-4">
                    <img 
                      src={member.photoUrl} 
                      alt={member.name} 
                      className="mx-auto h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full object-cover border-4 border-[var(--primary)]/10 shadow-lg group-hover:border-[var(--primary)]/30 transition-all duration-300"
                    />
                  </div>

                  {/* Name */}
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">
                    {member.name}
                  </h4>
                  
                  {/* Designation */}
                  <p className="text-xs sm:text-sm font-medium text-[var(--primary)] line-clamp-2">
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
