"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

function HospitalsList() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("hospitals")

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:5000/api/auth/getallhospitals")

        if (!response.ok) {
          throw new Error(`Error fetching hospitals: ${response.status}`)
        }

        const data = await response.json()
        setHospitals(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch hospitals:", err)
        setError("Failed to load hospitals. Please try again later.", err)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [])

  // Filter hospitals based on search term
  const filteredHospitals = hospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.a 
            href="/" 
            className="bg-gradient-to-r text-2xl font-bold from-teal-500 to-indigo-600 text-transparent bg-clip-text"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            mediseek.ai
          </motion.a>
          <nav className="hidden md:flex items-center space-x-8">
            {["Home","Your Report", "Dashboard","AI Groud", "Vault", "Our Doctors", "Hospitals", ].map((item, index) => (
              <motion.a
                key={index}
                href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                className={`${activeTab === item.toLowerCase() ? 'text-teal-600 font-medium' : 'text-gray-600 hover:text-gray-900'} relative`}
                onClick={(e) => {
                  if (e.currentTarget.getAttribute('href') === '#') {
                    e.preventDefault()
                    setActiveTab(item.toLowerCase())
                  }
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {item}
                {activeTab === item.toLowerCase() && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-500"
                    layoutId="navIndicator"
                  />
                )}
              </motion.a>
            ))}
          </nav>
          <motion.a
            href="/register-hospital"
            className="bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white px-5 py-2 rounded-lg shadow transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Hospitals</h1>
          <p className="text-gray-600">Browse our network of registered healthcare providers</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search hospitals by name or address..."
              className="w-full px-4 py-3 pl-12 text-gray-500 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-3.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
           
          </div>
         
        </motion.div>

        {/* Hospitals List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-teal-500 animate-spin"></div>
                <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin" style={{ animationDirection: 'reverse', opacity: 0.7 }}></div>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 text-red-600 p-6 rounded-lg shadow-sm border border-red-100"
            >
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hospitals"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredHospitals.length > 0 ? (
                filteredHospitals.map((hospital) => (
                  <motion.div
                    key={hospital._id}
                    variants={item}
                    whileHover={{ 
                      y: -8, 
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      transition: { duration: 0.2 } 
                    }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="bg-gradient-to-br from-teal-50 to-blue-50 p-3 rounded-lg"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="url(#hospital-icon-gradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <defs>
                            <linearGradient id="hospital-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#00bfa5" />
                              <stop offset="100%" stopColor="#5f68fe" />
                            </linearGradient>
                          </defs>
                          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                          <path d="M9 18V6"></path>
                          <path d="M15 18V6"></path>
                          <path d="M5 9h14"></path>
                          <path d="M5 15h14"></path>
                        </svg>
                      </motion.div>
                      <motion.a
                        href={`/hospitals/${hospital._id}`}
                        className="text-gray-400 hover:text-teal-500 transition-colors"
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </motion.a>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{hospital.name}</h3>
                    <div className="flex items-start space-x-2 text-gray-600 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 flex-shrink-0 text-gray-400"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <p>{hospital.address}</p>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div>
                        <span className="font-medium">Lat:</span> {hospital.location.coordinates[1].toFixed(6)}
                      </div>
                      <div>
                        <span className="font-medium">Long:</span> {hospital.location.coordinates[0].toFixed(6)}
                      </div>
                    </div>
                    <motion.div 
                      className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-500 to-indigo-500 opacity-0 rounded-bl-full"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full text-center py-12"
                >
                  <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg mb-2">No hospitals found matching your search.</p>
                    <p className="text-gray-400">Try adjusting your search terms or browse all hospitals.</p>
                    <motion.button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 text-teal-500 hover:text-teal-600 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear search
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Hospital CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-xl p-8 text-white overflow-hidden relative"
        >
          <motion.div 
            className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute -left-20 -bottom-20 w-64 h-64 bg-white opacity-10 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 4
            }}
          />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Register Your Hospital With Ease
            </motion.h2>
            <motion.p 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join our network of healthcare providers and increase your hospital's visibility. Our platform helps
              connect patients with the right care at the right time.
            </motion.p>
            <motion.a
              href="/register-hospital"
              className="inline-flex items-center bg-white text-black  bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors border-2 border-white hover:border-opacity-80"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Register Hospital
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#cta-arrow-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
              >
                <defs>
                  <linearGradient id="cta-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00bfa5" />
                    <stop offset="100%" stopColor="#5f68fe" />
                  </linearGradient>
                </defs>
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </motion.svg>
            </motion.a>
          </div>
        </motion.div>
        
        {/* Stats Section */}
        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {[
            { label: "Registered Hospitals", value: hospitals.length, icon: "hospital" },
            { label: "Patient Connections", value: "10,000+", icon: "users" },
            { label: "Cities Covered", value: "120+", icon: "map" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-3 rounded-lg">
                  {stat.icon === "hospital" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="url(#stat-icon-gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <defs>
                        <linearGradient id="stat-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00bfa5" />
                          <stop offset="100%" stopColor="#5f68fe" />
                        </linearGradient>
                      </defs>
                      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                      <path d="M9 18V6"></path>
                      <path d="M15 18V6"></path>
                      <path d="M5 9h14"></path>
                      <path d="M5 15h14"></path>
                    </svg>
                  )}
                  {stat.icon === "users" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="url(#stat-icon-gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  )}
                  {stat.icon === "map" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="url(#stat-icon-gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                      <line x1="8" y1="2" x2="8" y2="18"></line>
                      <line x1="16" y1="6" x2="16" y2="22"></line>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 text-transparent bg-clip-text">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            className="flex justify-center space-x-6 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {['facebook', 'twitter', 'linkedin'].map((social, index) => (
              <motion.a 
                key={index}
                href="#" 
                className="text-gray-400 hover:text-teal-500"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">{social}</span>
                {social === 'facebook' && (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {social === 'twitter' && (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                )}
                {social === 'linkedin' && (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </motion.a>
            ))}
          </motion.div>
          <motion.p 
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            &copy; {new Date().getFullYear()} mediseek.ai. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </div>
  )
}

export default HospitalsList