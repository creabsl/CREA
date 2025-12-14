import { motion } from 'framer-motion'
import { usePageTitle } from '../hooks/usePageTitle'

const developers = [
  {
    name: 'Aditya Kulkarni',
    role: 'Full Stack Developer',
    bio: 'Lead developer responsible for backend architecture, database design, and API development.',
    image: '', // Add image URL if available
    github: 'https://github.com/mostly-toast',
    linkedin: 'https://www.linkedin.com/in/adityakulkarni2004/',
    email: 'adityakulkarniwhat@gmail.com'
  },
  {
    name: 'Gaurav Ghatol',
    role: 'Full Stack Developer',
    bio: 'Frontend architecture, UI/UX implementation, and project coordination.',
    image: '', // Add image URL if available
    github: 'https://github.com/gauravghatol',
    linkedin: 'https://linkedin.com/in/gauravghatol',
    email: 'gauravghatol49@gmail.com'
  },
  {
    name: 'Aditya Siras',
    role: 'Full Stack Developer',
    bio: 'Lead developer responsible for backend architecture, database design, and API development.',
    image: '', // Add image URL if available
    github: 'https://github.com/aditya1492025',
    linkedin: 'https://linkedin.com/in/aditya-siras',
    email: 'adityasiras@gmail.com'
  },
  {
    name: 'Prajwal Kathole',
    role: 'Full Stack Developer',
    bio: 'Lead developer responsible for backend architecture, database design, and API development.',
    image: '', // Add image URL if available
    github: 'https://github.com/PrajwalKathole',
    linkedin: 'https://www.linkedin.com/in/prajwal-kathole-455799251/',
    email: 'prajwalkathole89@gmail.com'
  },
  {
    name: 'Sagar Palhade',
    role: 'Full Stack Developer',
    bio: 'Lead developer responsible for backend architecture, database design, and API development.',
    image: '', // Add image URL if available
    github: 'https://github.com/Saggy2323210',
    linkedin: 'https://www.linkedin.com/in/sagarpalhade2442/',
    email: 'sagarrajendrapalhade@gmail.com'
  }
]

export default function Developers() {
  usePageTitle('CREA • Development Team')

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold !text-white mb-2">Development Team</h1>
              <p className="text-white/90 text-lg">Built by engineers, for engineers</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-8 shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">About This Project</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The CREA platform is a comprehensive digital solution designed to strengthen the Central Railway 
          Engineers Association community. Built with modern web technologies, this platform facilitates 
          seamless communication, knowledge sharing, and community engagement among railway engineering professionals.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our mission is to create a robust, user-friendly platform that serves as the digital backbone 
          for CREA's operations, enabling efficient management of memberships, events, documents, and 
          community interactions.
        </p>
      </motion.div>

      {/* Developers Grid */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">Meet the Developers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {developers.map((dev, index) => (
            <motion.div
              key={dev.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {dev.image ? (
                    <img 
                      src={dev.image} 
                      alt={dev.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-[var(--primary)]/10"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-2xl font-bold">
                      {dev.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{dev.name}</h3>
                  <p className="text-sm font-medium text-[var(--accent)] mb-3">{dev.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{dev.bio}</p>
                  
                  <div className="flex items-center gap-3">
                    {dev.github && (
                      <a
                        href={dev.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                        title="GitHub"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {dev.linkedin && (
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors"
                        title="LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {dev.email && (
                      <a
                        href={`mailto:${dev.email}`}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent)]/80 transition-colors"
                        title="Email"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-8 shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-6">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'React', icon: '⚛️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { name: 'TypeScript', icon: '📘', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { name: 'Node.js', icon: '🟢', color: 'bg-green-50 text-green-700 border-green-200' },
            { name: 'MongoDB', icon: '🍃', color: 'bg-green-50 text-green-700 border-green-200' },
            { name: 'Express', icon: '⚡', color: 'bg-gray-50 text-gray-700 border-gray-200' },
            { name: 'Tailwind CSS', icon: '🎨', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
            { name: 'Framer Motion', icon: '🎭', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { name: 'Vite', icon: '⚡', color: 'bg-purple-50 text-purple-700 border-purple-200' },
          ].map((tech) => (
            <div
              key={tech.name}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${tech.color} transition-transform hover:scale-105`}
            >
              <span className="text-3xl mb-2">{tech.icon}</span>
              <span className="text-sm font-semibold">{tech.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Acknowledgments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Acknowledgments</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We would like to express our gratitude to the Central Railway Engineers Association for their 
          trust and support in developing this platform. Special thanks to all the members who provided 
          valuable feedback and insights during the development process.
        </p>
        <p className="text-gray-700 leading-relaxed">
          This platform is built with dedication to serve the railway engineering community and facilitate 
          better collaboration, knowledge sharing, and professional growth.
        </p>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-8 shadow-md border border-gray-200 text-center"
      >
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Questions or Feedback?</h2>
        <p className="text-gray-700 mb-6">
          We're always looking to improve. If you have any questions, suggestions, or feedback about the platform, 
          please don't hesitate to reach out.
        </p>
        <a
          href="mailto:secretary@crea.org"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] !text-white rounded-lg font-medium hover:bg-[var(--primary)]/80 shadow-md hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5 !text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Us
        </a>
      </motion.div>
    </div>
  )
}
