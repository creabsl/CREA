import { motion } from 'framer-motion'
import { usePageTitle } from '../hooks/usePageTitle'

const developers = [
  {
    name: 'Aditya Kulkarni',
    role: 'Full Stack Developer',
    image: '',
    github: 'https://github.com/mostly-toast',
    linkedin: 'https://www.linkedin.com/in/adityakulkarni2004/',
    email: 'adityakulkarniwhat@gmail.com'
  },
  {
    name: 'Aditya Siras',
    role: 'Full Stack Developer',
    image: '',
    github: 'https://github.com/aditya1492025',
    linkedin: 'https://linkedin.com/in/aditya-siras',
    email: 'adityasiras@gmail.com'
  },
  {
    name: 'Gaurav Ghatol',
    role: 'Full Stack Developer',
    image: '',
    github: 'https://github.com/gauravghatol',
    linkedin: 'https://linkedin.com/in/gauravghatol',
    email: 'gauravghatol49@gmail.com'
  },
  {
    name: 'Prajwal Kathole',
    role: 'Full Stack Developer',
    image: '',
    github: 'https://github.com/PrajwalKathole',
    linkedin: 'https://www.linkedin.com/in/prajwal-kathole-455799251/',
    email: 'prajwalkathole89@gmail.com'
  },
  {
    name: 'Sagar Palhade',
    role: 'Full Stack Developer',
    image: '',
    github: 'https://github.com/Saggy2323210',
    linkedin: 'https://www.linkedin.com/in/sagarpalhade2442/',
    email: 'sagarrajendrapalhade@gmail.com'
  }
]

export default function Developers() {
  usePageTitle('CREA • Development Team')

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] rounded-lg p-4 sm:p-6 md:p-8 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold !text-white mb-0.5 sm:mb-1">Development Team</h1>
              <p className="text-white/90 text-sm sm:text-base">Built by engineers, for engineers</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="px-4 sm:px-5 py-3 bg-blue-50 border-b border-blue-100">
          <h2 className="text-sm sm:text-base font-semibold text-[var(--primary)]">About This Project</h2>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2 sm:mb-3">
            The CREA platform is a comprehensive digital solution designed to strengthen the Central Railway 
            Engineers Association community. Built with modern web technologies, this platform facilitates 
            seamless communication, knowledge sharing, and community engagement among railway engineering professionals.
          </p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Our mission is to create a robust, user-friendly platform that serves as the digital backbone 
            for CREA's operations, enabling efficient management of memberships, events, documents, and 
            community interactions.
          </p>
        </div>
      </motion.div>

      {/* Developers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="px-4 sm:px-5 py-3 bg-orange-50 border-b border-orange-100">
          <h2 className="text-sm sm:text-base font-semibold text-[var(--accent)]">Meet the Developers</h2>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {developers.map((dev, index) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-gray-50 rounded border border-gray-200 p-3 sm:p-4 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0">
                    {dev.image ? (
                      <img 
                        src={dev.image} 
                        alt={dev.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#1a4d8f] flex items-center justify-center text-white text-base sm:text-lg font-bold">
                        {dev.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5">{dev.name}</h3>
                    <p className="text-[10px] sm:text-xs font-medium text-[var(--accent)] mb-2 sm:mb-3">{dev.role}</p>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {dev.github && (
                        <a
                          href={dev.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
                          title="GitHub"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {dev.linkedin && (
                        <a
                          href={dev.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors"
                          title="LinkedIn"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {dev.email && (
                        <a
                          href={`mailto:${dev.email}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent)]/80 transition-colors"
                          title="Email"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
          <h2 className="text-base font-semibold text-[var(--primary)]">Technology Stack</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'React', icon: '⚛️' },
              { name: 'TypeScript', icon: '📘' },
              { name: 'Node.js', icon: '🟢' },
              { name: 'MongoDB', icon: '🍃' },
              { name: 'Express', icon: '⚡' },
              { name: 'Tailwind', icon: '🎨' },
              { name: 'Framer', icon: '🎭' },
              { name: 'Vite', icon: '⚡' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center justify-center p-3 rounded border border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <span className="text-2xl mb-1">{tech.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Acknowledgments & Contact in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acknowledgments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="px-5 py-3 bg-orange-50 border-b border-orange-100">
            <h2 className="text-base font-semibold text-[var(--accent)]">Acknowledgments</h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              We express our gratitude to the Central Railway Engineers Association for their 
              trust and support in developing this platform.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Special thanks to all members who provided valuable feedback during development.
            </p>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
            <h2 className="text-base font-semibold text-[var(--primary)]">Questions or Feedback?</h2>
          </div>
          <div className="p-5 flex flex-col items-center justify-center h-[calc(100%-3rem)]">
            <p className="text-sm text-gray-700 text-center mb-4">
              We're always looking to improve. If you have any questions or feedback, please reach out.
            </p>
            <a
              href="mailto:secretary@crea.org"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] !text-white rounded font-medium text-sm hover:bg-[var(--primary)]/80 shadow-sm hover:shadow transition-all"
            >
              <svg className="w-4 h-4 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
