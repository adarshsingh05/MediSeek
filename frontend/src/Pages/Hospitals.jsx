"use client"

import { useState, useEffect } from "react"

export default function HospitalRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: "" })
  const [isLocating, setIsLocating] = useState(false)
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Assume you get user email from authentication or props
    const fetchedEmail = localStorage.getItem('email')||"user@example.com"; // Replace with actual source
    setUserEmail(fetchedEmail);
  }, []); // Runs only once when the component mounts
    const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const detectLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }))
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
          alert("Unable to retrieve your location. Please enter coordinates manually.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
      setIsLocating(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/addhospitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({ success: true, message: "Hospital registered successfully!" })
        setFormData({
          name: "",
          address: "",
          latitude: "",
          longitude: "",
        })
      } else {
        setSubmitStatus({ success: false, message: data.message || "Failed to register hospital." })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus({ success: false, message: "Network error. Please try again later." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-detect location when component mounts
  useEffect(() => {
    detectLocation()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
            <span className="bg-gradient-to-r text-2xl font-bold from-teal-500 to-indigo-600 text-transparent bg-clip-text">
                mediseek.ai
              </span>            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-blue-600 font-medium">
                Home
              </a>
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Hospitals
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Analytics
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Support
              </a>
            </div>
            <div className="flex items-center">
              <button                className="bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white px-5 py-2 rounded-lg shadow transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              HIPAA Compliant Healthcare Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-teal-500">Register</span> <span className="text-gray-400">Your</span> <span className="text-blue-600">Hospital </span><span className="text-gray-400">With Ease</span> </h1>
            <p className="text-gray-600 text-lg mb-8">
              Join our network of healthcare providers and increase your hospital's visibility. Our platform helps
              connect patients with the right care at the right time.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-400">HIPAA Compliant</span>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
                    <path d="M10 2a8 8 0 00-8 8h16a8 8 0 00-8-8z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-400">24/7 Support</span>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-400">Analytics</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Register Your Hospital</h2>

            {submitStatus.message && (
              <div
                className={`p-4 mb-6 rounded-md ${submitStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter hospital name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                 Your Email
                </label>
                <input
  type="text"
  id="email"
  name="email"
  value={userEmail} // Pre-filled value from state
  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-200 cursor-not-allowed"
  placeholder="Enter hospital name"
  disabled // Disables the input field
/>

              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Latitude"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block  text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Longitude"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  type="button"
                  onClick={detectLocation}
                  className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Detecting...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Detect My Location
                    </>
                  )}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Register Hospital"
                  )}
                </button>
              </div>
            </form>

            <div className="text-xs text-gray-500 mt-4">
              By registering, you agree to our{" "}
              <a href="#" className="text-teal-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-teal-600 hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Register Your Hospital?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Join our network and enjoy these benefits for your healthcare facility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl text-gray-600 font-bold mb-2">Increased Visibility</h3>
              <p className="text-gray-600">
                Get discovered by patients looking for healthcare services in your area. Improve your online presence.
              </p>
            </div>

            <div className="bg-teal-50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Access detailed analytics about patient inquiries, popular services, and performance metrics.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">Patient Communication</h3>
              <p className="text-gray-600">
                Streamline communication with patients through our secure messaging platform and appointment system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-teal-500 mb-4">mediseek.ai</div>
              <p className="text-gray-600 mb-4">Connecting patients with the right healthcare providers.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Solutions</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Hospital Registration
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Patient Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    API Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-600 hover:text-gray-900">
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-base text-gray-500 text-center">
              &copy; {new Date().getFullYear()} mediseek.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

